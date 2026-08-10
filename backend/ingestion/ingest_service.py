"""
IngestService Implementation
===========================
Loads raw GST CSV datasets, validates them using canonical Pydantic schemas
(Contract 1), logs validation errors to logs/ingestion_errors.json, and
outputs validated entities as Newline Delimited JSON (NDJSON) batches.
"""

import os
import json
import time
from datetime import datetime, date
from decimal import Decimal
import pandas as pd
from pydantic import ValidationError

from backend.ingestion.schemas import (
    Taxpayer,
    Invoice,
    ReturnFiling,
    Payment,
    IRN,
    DocumentType,
    GSTReturnType,
    ReturnFilingStatus,
)

DATA_DIR = os.path.join("backend", "ingestion", "dataset", "generated_data")
LOGS_DIR = "logs"
ERROR_LOG_PATH = os.path.join(LOGS_DIR, "ingestion_errors.json")


class IngestService:
    """Service to handle ingestion, validation, and batch export of GST data."""

    def __init__(self):
        self.timestamp = int(time.time())
        self.pid = os.getpid()
        self.errors = []
        os.makedirs(LOGS_DIR, exist_ok=True)
        os.makedirs(DATA_DIR, exist_ok=True)

    def log_error(self, entity_name: str, row_dict: dict, error: ValidationError):
        """Logs validation error details to internal storage."""
        error_entry = {
            "entity": entity_name,
            "row_data": {k: str(v) if isinstance(v, (date, datetime, Decimal)) else v for k, v in row_dict.items()},
            "errors": error.errors(include_url=False),
            "timestamp": datetime.utcnow().isoformat()
        }
        self.errors.append(error_entry)

    def write_ndjson(self, entity_name: str, items: list):
        """Writes list of verified Pydantic model objects to NDJSON file."""
        if not items:
            return
        filename = f"{entity_name.lower()}_batch_{self.timestamp}_p{self.pid}.ndjson"
        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            for item in items:
                f.write(json.dumps(item.model_dump(mode="json", by_alias=True)) + "\n")
        print(f"Ingested {len(items)} {entity_name} records to {filepath}")

    def save_errors(self):
        """Flushes recorded errors to logs/ingestion_errors.json."""
        if os.path.exists(ERROR_LOG_PATH):
            try:
                with open(ERROR_LOG_PATH, "r", encoding="utf-8") as f:
                    existing = json.load(f)
            except Exception:
                existing = []
        else:
            existing = []

        existing.extend(self.errors)
        with open(ERROR_LOG_PATH, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
        print(f"Logged {len(self.errors)} validation errors to {ERROR_LOG_PATH}")

    def process(self):
        print("Starting PramanaGST Ingestion Service...")
        
        # Reset the errors list for this run
        self.errors = []

        # 1. TAXPAYER
        taxpayers = []
        taxpayers_path = os.path.join(DATA_DIR, "taxpayers.csv")
        if os.path.exists(taxpayers_path):
            df = pd.read_csv(taxpayers_path, dtype=str)
            for _, row in df.iterrows():
                row_dict = row.to_dict()
                try:
                    reg_date = datetime.strptime(str(row_dict["registration_date"]).strip(), "%Y-%m-%d").date()
                    cancel_date = None
                    if pd.notna(row_dict.get("cancellation_date")) and str(row_dict["cancellation_date"]).strip():
                        cancel_date = datetime.strptime(str(row_dict["cancellation_date"]).strip(), "%Y-%m-%d").date()

                    trade_name = None
                    if pd.notna(row_dict.get("trade_name")) and str(row_dict["trade_name"]).strip():
                        trade_name = str(row_dict["trade_name"]).strip()

                    tp = Taxpayer(
                        gstin=str(row_dict["gstin"]).strip(),
                        legal_name=str(row_dict["legal_name"]).strip(),
                        trade_name=trade_name,
                        registration_type=str(row_dict["registration_type"]).strip(),
                        registration_status=str(row_dict["registration_status"]).strip(),
                        registration_date=reg_date,
                        cancellation_date=cancel_date,
                        state_code=str(row_dict["state_code"]).strip().zfill(2),
                        pan=str(row_dict["pan"]).strip()
                    )
                    taxpayers.append(tp)
                except ValidationError as e:
                    self.log_error("TAXPAYER", row_dict, e)
                except Exception as e:
                    print(f"Error parsing taxpayer row {row_dict}: {e}")
            self.write_ndjson("TAXPAYER", taxpayers)

        # 2. INVOICE
        invoices = []
        gstr1_path = os.path.join(DATA_DIR, "gstr1.csv")
        supplier_gstin_map = {}  # invoice_number -> supplier_gstin lookup for IRNs
        invoice_types_map = {}   # invoice_number -> inter/intra supply_type lookup for ReturnFiling
        invoice_tax_map = {}     # invoice_number -> tax details for GSTR-2B aggregation

        if os.path.exists(gstr1_path):
            df = pd.read_csv(gstr1_path, dtype=str)
            for _, row in df.iterrows():
                row_dict = row.to_dict()
                try:
                    inv_date = datetime.strptime(str(row_dict["invoice_date"]).strip(), "%Y-%m-%d").date()
                    rec_gstin = None
                    if pd.notna(row_dict.get("recipient_gstin")) and str(row_dict["recipient_gstin"]).strip():
                        rec_gstin = str(row_dict["recipient_gstin"]).strip()

                    irn_val = None
                    if pd.notna(row_dict.get("irn")) and str(row_dict["irn"]).strip():
                        irn_val = str(row_dict["irn"]).strip()

                    rev_charge = str(row_dict.get("reverse_charge")).strip().lower() in ("true", "1", "yes")

                    inv = Invoice(
                        invoice_number=str(row_dict["invoice_number"]).strip(),
                        invoice_date=inv_date,
                        invoice_type=str(row_dict["invoice_type"]).strip(),
                        invoice_status=str(row_dict["invoice_status"]).strip(),
                        supply_type=str(row_dict["supply_type"]).strip(),
                        document_type=str(row_dict["document_type"]).strip(),
                        supplier_gstin=str(row_dict["supplier_gstin"]).strip(),
                        recipient_gstin=rec_gstin,
                        taxable_value=Decimal(str(row_dict["taxable_value"]).strip()),
                        igst_amount=Decimal(str(row_dict["igst_amount"]).strip()),
                        cgst_amount=Decimal(str(row_dict["cgst_amount"]).strip()),
                        sgst_amount=Decimal(str(row_dict["sgst_amount"]).strip()),
                        cess_amount=Decimal(str(row_dict["cess_amount"]).strip()),
                        total_value=Decimal(str(row_dict["invoice_value"]).strip()),
                        place_of_supply=str(row_dict["place_of_supply"]).strip().zfill(2),
                        reverse_charge=rev_charge,
                        irn=irn_val,
                        filing_period=str(row_dict["filing_period"]).strip()
                    )
                    invoices.append(inv)
                    supplier_gstin_map[inv.invoice_number] = inv.supplier_gstin
                    invoice_types_map[inv.invoice_number] = inv.supply_type
                    invoice_tax_map[inv.invoice_number] = {
                        "igst": inv.igst_amount,
                        "cgst": inv.cgst_amount,
                        "sgst": inv.sgst_amount
                    }
                except ValidationError as e:
                    self.log_error("INVOICE", row_dict, e)
                except Exception as e:
                    print(f"Error parsing invoice row {row_dict}: {e}")
            self.write_ndjson("INVOICE", invoices)

        # 3. IRN
        irns = []
        einvoice_path = os.path.join(DATA_DIR, "einvoice.csv")
        if os.path.exists(einvoice_path):
            df = pd.read_csv(einvoice_path, dtype=str)
            for _, row in df.iterrows():
                row_dict = row.to_dict()
                try:
                    inv_num = str(row_dict["invoice_number"]).strip()
                    ts = datetime.fromisoformat(str(row_dict["generation_timestamp"]).strip())
                    supplier_gstin = supplier_gstin_map.get(inv_num, "00AAAAB0000A0Z0")

                    irn_obj = IRN(
                        irn=str(row_dict["irn"]).strip(),
                        irn_date=ts,
                        irn_status=str(row_dict["status"]).strip(),
                        invoice_number=inv_num,
                        supplier_gstin=supplier_gstin,
                        document_type=DocumentType.INV,
                        ack_number=f"ACK{inv_num.replace('-', '')}",
                        ack_date=ts
                    )
                    irns.append(irn_obj)
                except ValidationError as e:
                    self.log_error("IRN", row_dict, e)
                except Exception as e:
                    print(f"Error parsing IRN row {row_dict}: {e}")
            self.write_ndjson("IRN", irns)

        # 4. PAYMENT
        payments = []
        payments_path = os.path.join(DATA_DIR, "payments.csv")
        payments_list = []
        if os.path.exists(payments_path):
            df = pd.read_csv(payments_path, dtype=str)
            for _, row in df.iterrows():
                row_dict = row.to_dict()
                try:
                    pay_date = datetime.strptime(str(row_dict["payment_date"]).strip(), "%Y-%m-%d").date()
                    challan = None
                    if pd.notna(row_dict.get("challan_number")) and str(row_dict["challan_number"]).strip():
                        challan = str(row_dict["challan_number"]).strip()

                    bank_ref = None
                    if pd.notna(row_dict.get("bank_reference")) and str(row_dict["bank_reference"]).strip():
                        bank_ref = str(row_dict["bank_reference"]).strip()

                    pmt = Payment(
                        payment_id=str(row_dict["payment_id"]).strip(),
                        gstin=str(row_dict["supplier_gstin"]).strip(),
                        return_period=str(row_dict["return_period"]).strip(),
                        payment_date=pay_date,
                        payment_mode=str(row_dict["payment_mode"]).strip(),
                        payment_status=str(row_dict["payment_status"]).strip(),
                        igst_paid=Decimal(str(row_dict["igst_paid"]).strip()),
                        cgst_paid=Decimal(str(row_dict["cgst_paid"]).strip()),
                        sgst_paid=Decimal(str(row_dict["sgst_paid"]).strip()),
                        cess_paid=Decimal(str(row_dict["cess_paid"]).strip()),
                        total_paid=Decimal(str(row_dict["tax_paid"]).strip()),
                        challan_number=challan,
                        bank_reference=bank_ref
                    )
                    payments.append(pmt)
                    payments_list.append(row_dict)
                except ValidationError as e:
                    self.log_error("PAYMENT", row_dict, e)
                except Exception as e:
                    print(f"Error parsing payment row {row_dict}: {e}")
            self.write_ndjson("PAYMENT", payments)

        # 5. RETURN (ReturnFiling)
        returns = []

        # Generate GSTR-3B filings from Payments
        for p in payments_list:
            try:
                ret_id = f"RET-{str(p['supplier_gstin']).strip()}-GSTR3B-{str(p['return_period']).strip()}"
                tax_paid = Decimal(str(p["tax_paid"]).strip())
                ret_3b = ReturnFiling(
                    return_id=ret_id,
                    gstin=str(p["supplier_gstin"]).strip(),
                    return_type=GSTReturnType.GSTR3B,
                    return_period=str(p["return_period"]).strip(),
                    filing_date=datetime.strptime(str(p["payment_date"]).strip(), "%Y-%m-%d").date(),
                    filing_status=ReturnFilingStatus.FILED,
                    total_taxable_value=Decimal("0.00"),
                    total_igst=Decimal(str(p["igst_paid"]).strip()),
                    total_cgst=Decimal(str(p["cgst_paid"]).strip()),
                    total_sgst=Decimal(str(p["sgst_paid"]).strip()),
                    total_cess=Decimal(str(p["cess_paid"]).strip()),
                    total_tax_liability=tax_paid,
                    itc_claimed_igst=Decimal("0.00"),
                    itc_claimed_cgst=Decimal("0.00"),
                    itc_claimed_sgst=Decimal("0.00"),
                    itc_claimed_cess=Decimal("0.00")
                )
                returns.append(ret_3b)
            except ValidationError as e:
                self.log_error("RETURN_3B", p, e)

        # Generate GSTR-2B filings from GSTR-2B CSV
        gstr2b_path = os.path.join(DATA_DIR, "gstr2b.csv")
        if os.path.exists(gstr2b_path):
            df = pd.read_csv(gstr2b_path, dtype=str)
            grouped = df.groupby(["recipient_gstin", "claim_period"])
            for (rec_gstin, claim_period), group in grouped:
                try:
                    igst_sum = Decimal("0.00")
                    cgst_sum = Decimal("0.00")
                    sgst_sum = Decimal("0.00")

                    for _, row in group.iterrows():
                        inv_num = str(row["invoice_number"]).strip()
                        itc_claimed = Decimal(str(row["itc_claimed"]).strip())
                        supply_type = invoice_types_map.get(inv_num, "INTRA_STATE")

                        if supply_type == "INTER_STATE":
                            igst_sum += itc_claimed
                        else:
                            half_itc = itc_claimed / Decimal("2")
                            cgst_sum += half_itc
                            sgst_sum += half_itc

                    ret_id = f"RET-{str(rec_gstin).strip()}-GSTR2B-{str(claim_period).strip()}"
                    ret_2b = ReturnFiling(
                        return_id=ret_id,
                        gstin=str(rec_gstin).strip(),
                        return_type=GSTReturnType.GSTR2B,
                        return_period=str(claim_period).strip(),
                        filing_date=date(2026, 2, 12),
                        filing_status=ReturnFilingStatus.FILED,
                        total_taxable_value=Decimal("0.00"),
                        total_igst=Decimal("0.00"),
                        total_cgst=Decimal("0.00"),
                        total_sgst=Decimal("0.00"),
                        total_cess=Decimal("0.00"),
                        total_tax_liability=Decimal("0.00"),
                        itc_claimed_igst=igst_sum,
                        itc_claimed_cgst=cgst_sum,
                        itc_claimed_sgst=sgst_sum,
                        itc_claimed_cess=Decimal("0.00")
                    )
                    returns.append(ret_2b)
                except ValidationError as e:
                    self.log_error("RETURN_2B", {"recipient_gstin": rec_gstin, "claim_period": claim_period}, e)
                except Exception as e:
                    print(f"Error building GSTR-2B return for {rec_gstin} / {claim_period}: {e}")

        self.write_ndjson("RETURN", returns)

        # 6. Save ingestion errors to JSON log
        self.save_errors()
        print("Ingestion processing completed successfully.")


if __name__ == "__main__":
    service = IngestService()
    service.process()
