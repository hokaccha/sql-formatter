# SQL Formatter

Forked from [zeroturnaround/sql-formatter](https://github.com/zeroturnaround/sql-formatter) but with improvements and ported Typescript.

**SQL Formatter** is a JavaScript library for pretty-printing SQL queries.
It started as a port of a [PHP Library](https://github.com/jdorn/sql-formatter), but has since considerably diverged.

SQL formatter supports the following dialects:

- **sql** - [Standard SQL](https://en.wikipedia.org/wiki/SQL:2011)
- **mariadb** - [MariaDB](https://mariadb.com/)
- **mysql** - [MySQL](https://mariadb.com/)
- **postgresql** - [PostgreSQL](https://www.postgresql.org/)
- **db2** - [IBM DB2](https://www.ibm.com/analytics/us/en/technology/db2/)
- **plsql** - [Oracle PL/SQL](https://www.oracle.com/database/technologies/appdev/plsql.html)
- **n1ql** - [Couchbase N1QL](http://www.couchbase.com/n1ql)
- **redshift** - [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html)
- **spark** - [Spark](https://spark.apache.org/docs/latest/api/sql/index.html)
- **tsql** - [SQL Server Transact-SQL](https://docs.microsoft.com/en-us/sql/sql-server/)

It does not support:

- Stored procedures.
- Changing of the delimiter type to something else than `;`.

## Install

Get the latest version from NPM:

```sh
npm install @hokaccha/sql-formatter
```

## Usage as library

```js
import { format } from "sql-formatter";

console.log(format("SELECT * FROM tbl"));
```

This will output:

```sql
SELECT
  *
FROM
  tbl
```

You can also pass in configuration options:

```js
format("SELECT * FROM tbl", {
  language: "spark", // Defaults to "sql" (see the above list of supported dialects)
  indent: "    ", // Defaults to two spaces
  uppercase: bool, // Defaults to false (not safe to use when SQL dialect has case-sensitive identifiers)
  linesBetweenQueries: 2, // Defaults to 1
});
```

### Placeholders replacement

```js
// Named placeholders
format("SELECT * FROM tbl WHERE foo = @foo", {
  params: {foo: "'bar'"}
}));

// Indexed placeholders
format("SELECT * FROM tbl WHERE foo = ?", {
  params: ["'bar'"]
}));
```

Both result in:

```
SELECT
  *
FROM
  tbl
WHERE
  foo = 'bar'
```

## License

[MIT](https://github.com/hokaccha/sql-formatter/blob/main/LICENSE)
