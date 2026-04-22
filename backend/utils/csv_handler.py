import os
import pandas as pd
from utils.sql_runner import load_csv_to_db

DATA_FOLDER = "data"


def save_uploaded_file(upload_file) -> str:
    os.makedirs(DATA_FOLDER, exist_ok=True)
    file_path = os.path.join(DATA_FOLDER, upload_file.filename)

    with open(file_path, "wb") as f:
        f.write(upload_file.file.read())

    return file_path


def read_csv_preview(file_path: str) -> dict:
    df = pd.read_csv(file_path)
    df = df.loc[:, ~df.columns.str.contains(r"^Unnamed")]

    load_csv_to_db(file_path)

    return {
        "filename": os.path.basename(file_path),
        "columns": df.columns.tolist(),
        "total_rows": int(len(df)),
        "preview": df.head(5).fillna("").to_dict(orient="records"),
    }