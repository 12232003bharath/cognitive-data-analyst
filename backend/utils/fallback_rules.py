import re


def try_simple_rule(question: str, columns: list[str], numeric_columns: list[str]):
    q = question.lower().strip()

    lower_map = {c.lower(): c for c in columns}

    def find_col():
        for lc, orig in lower_map.items():
            if lc in q:
                return orig
        return None

    matched = find_col()

    if "how many rows" in q or "total rows" in q or "count rows" in q:
        return "SELECT COUNT(*) AS total_rows FROM dataset"

    if "show columns" in q or "list columns" in q:
        return None

    if ("average" in q or "avg" in q) and matched and matched in numeric_columns:
        return f'SELECT AVG("{matched}") AS avg_{matched.lower()} FROM dataset'

    if ("sum" in q or "total" in q) and matched and matched in numeric_columns:
        return f'SELECT SUM("{matched}") AS total_{matched.lower()} FROM dataset'

    if ("count by" in q or "distribution of" in q) and matched:
        return f'''
        SELECT "{matched}", COUNT(*) AS count
        FROM dataset
        GROUP BY "{matched}"
        ORDER BY count DESC
        '''

    # NEW: simple equality filter
    match = re.search(r"where\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)", question, re.IGNORECASE)
    if match:
        raw_col = match.group(1).strip()
        raw_value = match.group(2).strip().strip("'").strip('"')

        actual_col = None
        for col in columns:
            if col.lower() == raw_col.lower():
                actual_col = col
                break

        if actual_col:
            if actual_col in numeric_columns:
                return f'SELECT * FROM dataset WHERE "{actual_col}" = {raw_value} LIMIT 50'
            else:
                safe_value = raw_value.replace("'", "''")
                return f'SELECT * FROM dataset WHERE "{actual_col}" = \'{safe_value}\' LIMIT 50'

    return None