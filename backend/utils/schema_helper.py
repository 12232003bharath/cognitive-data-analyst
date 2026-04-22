import pandas as pd
from typing import Any


def classify_column_dtype(dtype_str: str) -> str:
    d = dtype_str.lower()

    if any(x in d for x in ["int", "float", "double"]):
        return "number"
    if "bool" in d:
        return "boolean"
    if "datetime" in d or "date" in d:
        return "date"
    return "text"


def build_schema_payload(df: pd.DataFrame) -> dict[str, Any]:
    df = df.loc[:, ~df.columns.str.contains(r"^Unnamed")]

    columns = []
    for col in df.columns:
        dtype_str = str(df[col].dtype)
        semantic_type = classify_column_dtype(dtype_str)

        sample_values = (
            df[col]
            .dropna()
            .astype(str)
            .head(5)
            .tolist()
        )

        columns.append(
            {
                "name": col,
                "dtype": dtype_str,
                "semantic_type": semantic_type,
                "sample_values": sample_values,
            }
        )

    return {
        "table_name": "dataset",
        "row_count": int(len(df)),
        "columns": columns,
    }