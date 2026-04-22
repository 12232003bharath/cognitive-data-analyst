from typing import Any


def quote_ident(col: str) -> str:
    return f'"{col}"'


def sql_literal(value: Any) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)

    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def build_filter_sql(f: dict[str, Any]) -> str:
    col = quote_ident(f["column"])
    op = f["operator"]
    value = f["value"]

    if op == "contains":
        return f"{col} ILIKE '%' || {sql_literal(value)} || '%'"
    if op == "starts_with":
        return f"{col} ILIKE {sql_literal(str(value) + '%')}"
    if op == "ends_with":
        return f"{col} ILIKE {sql_literal('%' + str(value))}"

    return f"{col} {op} {sql_literal(value)}"


def build_agg_sql(agg: dict[str, Any]) -> str:
    func = agg["function"]
    col = quote_ident(agg["column"])
    alias = quote_ident(agg["alias"])

    if func == "count":
        return f"COUNT({col}) AS {alias}"
    if func == "count_distinct":
        return f"COUNT(DISTINCT {col}) AS {alias}"
    if func == "sum":
        return f"SUM({col}) AS {alias}"
    if func == "avg":
        return f"AVG({col}) AS {alias}"
    if func == "min":
        return f"MIN({col}) AS {alias}"
    if func == "max":
        return f"MAX({col}) AS {alias}"

    raise ValueError(f"Unsupported aggregation: {func}")


def build_sql_from_plan(plan: dict[str, Any]) -> str:
    select_parts = []
    select_columns = plan.get("select_columns", [])
    aggregations = plan.get("aggregations", [])
    filters = plan.get("filters", [])
    group_by = plan.get("group_by", [])
    order_by = plan.get("order_by", [])
    limit = plan.get("limit")

    for col in select_columns:
        select_parts.append(quote_ident(col))

    for agg in aggregations:
        select_parts.append(build_agg_sql(agg))

    if not select_parts:
        select_parts = ["*"]

    sql = f"SELECT {', '.join(select_parts)} FROM dataset"

    if filters:
        where_clause = " AND ".join(build_filter_sql(f) for f in filters)
        sql += f" WHERE {where_clause}"

    if group_by:
        sql += " GROUP BY " + ", ".join(quote_ident(col) for col in group_by)

    if order_by:
        order_parts = []
        for item in order_by:
            direction = item["direction"].upper()
            order_parts.append(f'{quote_ident(item["column"])} {direction}')
        sql += " ORDER BY " + ", ".join(order_parts)

    if limit:
        sql += f" LIMIT {int(limit)}"

    return sql