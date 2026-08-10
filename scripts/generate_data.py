"""
PramanaGST Synthetic Data Generator
===================================
Generates mock CSV datasets that strictly comply with Contract-1 schemas
and scripts/validator.py rules.
"""

import os
import pandas as pd

DATA_DIR = os.path.join("backend", "ingestion", "dataset", "generated_data")


def main():
    print(f"Creating directory: {DATA_DIR}")
    os.makedirs(DATA_DIR, exist_ok=True)

    # 1. Taxpayers
    taxpayers_df = pd.DataFrame([
        {
            "gstin": "27AAPFU0939F1ZV",
            "legal_name": "Pramana Enterprises Private Limited",
            "trade_name": "Pramana Trade",
            "registration_type": "REGULAR",
            "registration_status": "ACTIVE",
            "registration_date": "2017-07-01",
            "cancellation_date": "",
            "state_code": "27",
            "pan": "AAPFU0939F"
        },
        {
            "gstin": "29AABCU9603R1ZM",
            "legal_name": "Vantage Logistics Corp",
            "trade_name": "",
            "registration_type": "REGULAR",
            "registration_status": "ACTIVE",
            "registration_date": "2018-04-15",
            "cancellation_date": "",
            "state_code": "29",
            "pan": "AABCU9603R"
        },
        {
            "gstin": "27AADCB1234A1Z1",
            "legal_name": "Vertex AI Services Ltd",
            "trade_name": "Vertex Services",
            "registration_type": "REGULAR",
            "registration_status": "ACTIVE",
            "registration_date": "2019-01-01",
            "cancellation_date": "",
            "state_code": "27",
            "pan": "AADCB1234A"
        },
        {
            "gstin": "27ABCDE5678B1Z2",
            "legal_name": "Circular Traders Co",
            "trade_name": "CTC",
            "registration_type": "REGULAR",
            "registration_status": "ACTIVE",
            "registration_date": "2020-03-01",
            "cancellation_date": "",
            "state_code": "27",
            "pan": "ABCDE5678B"
        }
    ])
    taxpayers_df.to_csv(os.path.join(DATA_DIR, "taxpayers.csv"), index=False)
    print("Saved taxpayers.csv")

    # 2. GSTR-1 Invoices
    gstr1_df = pd.DataFrame([
        {
            "invoice_number": "INV-2026-001",
            "invoice_date": "2026-01-15",
            "invoice_type": "B2B",
            "invoice_status": "ACTIVE",
            "supply_type": "INTER_STATE",
            "document_type": "INV",
            "supplier_gstin": "27AAPFU0939F1ZV",
            "recipient_gstin": "29AABCU9603R1ZM",
            "taxable_value": 100000.00,
            "igst_amount": 18000.00,
            "cgst_amount": 0.00,
            "sgst_amount": 0.00,
            "cess_amount": 0.00,
            "invoice_value": 118000.00,
            "place_of_supply": "29",
            "reverse_charge": False,
            "irn": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "filing_period": "012026"
        },
        {
            "invoice_number": "INV-2026-002",
            "invoice_date": "2026-01-18",
            "invoice_type": "B2B",
            "invoice_status": "ACTIVE",
            "supply_type": "INTRA_STATE",
            "document_type": "INV",
            "supplier_gstin": "27AAPFU0939F1ZV",
            "recipient_gstin": "27AADCB1234A1Z1",
            "taxable_value": 50000.00,
            "igst_amount": 0.00,
            "cgst_amount": 4500.00,
            "sgst_amount": 4500.00,
            "cess_amount": 0.00,
            "invoice_value": 59000.00,
            "place_of_supply": "27",
            "reverse_charge": False,
            "irn": "8f435017e2c94383c2718e268a7f4571d0e145b23d92fb9c3d402377b5c879ff",
            "filing_period": "012026"
        }
    ])
    gstr1_df.to_csv(os.path.join(DATA_DIR, "gstr1.csv"), index=False)
    print("Saved gstr1.csv")

    # 3. GSTR-2B (Drafted ITC)
    gstr2b_df = pd.DataFrame([
        {
            "recipient_gstin": "29AABCU9603R1ZM",
            "invoice_number": "INV-2026-001",
            "claim_period": "012026",
            "itc_claimed": 18000.00
        },
        {
            "recipient_gstin": "27AADCB1234A1Z1",
            "invoice_number": "INV-2026-002",
            "claim_period": "012026",
            "itc_claimed": 9000.00
        }
    ])
    gstr2b_df.to_csv(os.path.join(DATA_DIR, "gstr2b.csv"), index=False)
    print("Saved gstr2b.csv")

    # 4. Payments (Summary return tax payments)
    payments_df = pd.DataFrame([
        {
            "payment_id": "PMT-27AAPFU0939F1ZV-012026-001",
            "supplier_gstin": "27AAPFU0939F1ZV",
            "return_period": "012026",
            "payment_date": "2026-02-20",
            "payment_mode": "CASH",
            "payment_status": "PAID",
            "igst_paid": 18000.00,
            "cgst_paid": 4500.00,
            "sgst_paid": 4500.00,
            "cess_paid": 0.00,
            "tax_paid": 27000.00,
            "challan_number": "CIN202602200001",
            "bank_reference": "BRN202602200001"
        }
    ])
    payments_df.to_csv(os.path.join(DATA_DIR, "payments.csv"), index=False)
    print("Saved payments.csv")

    # 5. E-Invoices
    einvoice_df = pd.DataFrame([
        {
            "invoice_number": "INV-2026-001",
            "generation_timestamp": "2026-01-15T10:30:00",
            "irn": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "status": "ACTIVE"
        },
        {
            "invoice_number": "INV-2026-002",
            "generation_timestamp": "2026-01-18T14:45:00",
            "irn": "8f435017e2c94383c2718e268a7f4571d0e145b23d92fb9c3d402377b5c879ff",
            "status": "ACTIVE"
        }
    ])
    einvoice_df.to_csv(os.path.join(DATA_DIR, "einvoice.csv"), index=False)
    print("Saved einvoice.csv")

    print("\nAll synthetic datasets successfully generated.")


if __name__ == "__main__":
    main()
