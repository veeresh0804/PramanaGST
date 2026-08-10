"""
Contract v1.0.0 — Ingestion Pipeline Integration Test
=====================================================
Runs the entire ingestion pipeline end-to-end:
1. Clean old batch files.
2. Run synthetic dataset generator.
3. Execute IngestService to parse, validate, and write NDJSON outputs.
4. Verify that generated NDJSON files exist and strictly conform to schemas.
5. Verify that there are zero validation errors logged.
"""

import os
import glob
import json
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.generate_data import main as run_generator
from backend.ingestion.ingest_service import IngestService
from backend.ingestion.schemas import (
    Taxpayer,
    Invoice,
    ReturnFiling,
    Payment,
    IRN,
)

DATA_DIR = Path("backend") / "ingestion" / "dataset" / "generated_data"
LOGS_DIR = Path("logs")
ERROR_LOG_PATH = LOGS_DIR / "ingestion_errors.json"


def clean_old_batches():
    """Removes any previous ndjson output files to ensure test isolation."""
    for ndjson_file in glob.glob(str(DATA_DIR / "*.ndjson")):
        try:
            os.remove(ndjson_file)
        except OSError:
            pass

    # Clear error log
    if ERROR_LOG_PATH.exists():
        try:
            os.remove(ERROR_LOG_PATH)
        except OSError:
            pass


def get_batch_file(prefix: str) -> Path:
    """Finds the generated ndjson file starting with the given prefix."""
    matches = list(DATA_DIR.glob(f"{prefix}_batch_*.ndjson"))
    assert len(matches) >= 1, f"Expected at least one {prefix} batch file, found none!"
    return matches[0]


def verify_ndjson_records(filepath: Path, model_cls):
    """Reads lines from an NDJSON file and verifies they successfully instantiate the Pydantic model."""
    print(f"  Verifying {filepath.name} ...")
    assert filepath.stat().st_size > 0, f"File {filepath.name} is empty!"
    
    count = 0
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line_str = line.strip()
            if not line_str:
                continue
            data = json.loads(line_str)
            # This should instantiate successfully without throwing ValidationError
            model_cls.model_validate(data)
            count += 1
    
    assert count > 0, f"No records found in {filepath.name}!"
    print(f"  [OK] Successfully validated {count} {model_cls.__name__} records.")


def test_pipeline_end_to_end():
    print("=" * 60)
    print("INGESTION PIPELINE -- End-to-End Integration Test")
    print("=" * 60)

    # 1. Clean previous run state
    print("\n[STEP 1] Cleaning previous batch outputs...")
    clean_old_batches()
    print("  [OK] Cleaned previous batches.")

    # 2. Run synthetic dataset generator
    print("\n[STEP 2] Generating CSV datasets...")
    run_generator()
    print("  [OK] Generated CSV files.")

    # 3. Execute IngestService
    print("\n[STEP 3] Running IngestService ingestion pipeline...")
    service = IngestService()
    service.process()
    print("  [OK] IngestService finished.")

    # 4. Verify generated NDJSON batch files
    print("\n[STEP 4] Verifying generated NDJSON schemas and records...")
    
    taxpayer_file = get_batch_file("taxpayer")
    verify_ndjson_records(taxpayer_file, Taxpayer)

    invoice_file = get_batch_file("invoice")
    verify_ndjson_records(invoice_file, Invoice)

    irn_file = get_batch_file("irn")
    verify_ndjson_records(irn_file, IRN)

    payment_file = get_batch_file("payment")
    verify_ndjson_records(payment_file, Payment)

    return_file = get_batch_file("return")
    verify_ndjson_records(return_file, ReturnFiling)

    # 5. Check error log status
    print("\n[STEP 5] Checking for logged validation errors...")
    if ERROR_LOG_PATH.exists():
        with open(ERROR_LOG_PATH, "r", encoding="utf-8") as f:
            errors = json.load(f)
        assert len(errors) == 0, f"Ingestion pipeline logged {len(errors)} validation errors! Check: {ERROR_LOG_PATH}"
    
    print("  [OK] Checked error logs: 0 validation errors found.")

    print("\n" + "=" * 60)
    print("[OK] INTEGRATION TEST PASSED -- Ingestion pipeline is 100% correct.")
    print("=" * 60)


if __name__ == "__main__":
    try:
        test_pipeline_end_to_end()
        sys.exit(0)
    except Exception as e:
        print(f"\n[FAIL] Test pipeline failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
