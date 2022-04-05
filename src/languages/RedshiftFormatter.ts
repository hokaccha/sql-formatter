import Formatter from "../core/Formatter";
import Tokenizer from "../core/Tokenizer";

const reservedWords = [
  "AES128",
  "AES256",
  "ALLOWOVERWRITE",
  "ANALYSE",
  "ARRAY",
  "AS",
  "ASC",
  "AUTHORIZATION",
  "BACKUP",
  "BINARY",
  "BLANKSASNULL",
  "BOTH",
  "BYTEDICT",
  "BZIP2",
  "CAST",
  "CHECK",
  "COLLATE",
  "COLUMN",
  "CONSTRAINT",
  "CREATE",
  "CREDENTIALS",
  "CURRENT_DATE",
  "CURRENT_TIME",
  "CURRENT_TIMESTAMP",
  "CURRENT_USER",
  "CURRENT_USER_ID",
  "DEFAULT",
  "DEFERRABLE",
  "DEFLATE",
  "DEFRAG",
  "DELTA",
  "DELTA32K",
  "DESC",
  "DISABLE",
  "DISTINCT",
  "DO",
  "ELSE",
  "EMPTYASNULL",
  "ENABLE",
  "ENCODE",
  "ENCRYPT",
  "ENCRYPTION",
  "END",
  "EXPLICIT",
  "FALSE",
  "FOR",
  "FOREIGN",
  "FREEZE",
  "FULL",
  "GLOBALDICT256",
  "GLOBALDICT64K",
  "GRANT",
  "GZIP",
  "IDENTITY",
  "IGNORE",
  "ILIKE",
  "INITIALLY",
  "INTO",
  "LEADING",
  "LOCALTIME",
  "LOCALTIMESTAMP",
  "LUN",
  "LUNS",
  "LZO",
  "LZOP",
  "MINUS",
  "MOSTLY13",
  "MOSTLY32",
  "MOSTLY8",
  "NATURAL",
  "NEW",
  "NULLS",
  "OFF",
  "OFFLINE",
  "OFFSET",
  "OLD",
  "ON",
  "ONLY",
  "OPEN",
  "ORDER",
  "OVERLAPS",
  "PARALLEL",
  "PARTITION",
  "PERCENT",
  "PERMISSIONS",
  "PLACING",
  "PRIMARY",
  "RAW",
  "READRATIO",
  "RECOVER",
  "REFERENCES",
  "REJECTLOG",
  "RESORT",
  "RESTORE",
  "SESSION_USER",
  "SIMILAR",
  "SYSDATE",
  "SYSTEM",
  "TABLE",
  "TAG",
  "TDES",
  "TEXT255",
  "TEXT32K",
  "THEN",
  "TIMESTAMP",
  "TO",
  "TOP",
  "TRAILING",
  "TRUE",
  "TRUNCATECOLUMNS",
  "UNIQUE",
  "USER",
  "USING",
  "VERBOSE",
  "WALLET",
  "WHEN",
  "WITH",
  "WITHOUT",
  "PREDICATE",
  "COLUMNS",
  "COMPROWS",
  "COMPRESSION",
  "COPY",
  "FORMAT",
  "DELIMITER",
  "FIXEDWIDTH",
  "AVRO",
  "JSON",
  "ENCRYPTED",
  "BZIP2",
  "GZIP",
  "LZOP",
  "PARQUET",
  "ORC",
  "ACCEPTANYDATE",
  "ACCEPTINVCHARS",
  "BLANKSASNULL",
  "DATEFORMAT",
  "EMPTYASNULL",
  "ENCODING",
  "ESCAPE",
  "EXPLICIT_IDS",
  "FILLRECORD",
  "IGNOREBLANKLINES",
  "IGNOREHEADER",
  "NULL AS",
  "REMOVEQUOTES",
  "ROUNDEC",
  "TIMEFORMAT",
  "TRIMBLANKS",
  "TRUNCATECOLUMNS",
  "COMPROWS",
  "COMPUPDATE",
  "MAXERROR",
  "NOLOAD",
  "STATUPDATE",
  "MANIFEST",
  "REGION",
  "IAM_ROLE",
  "MASTER_SYMMETRIC_KEY",
  "SSH",
  "ACCEPTANYDATE",
  "ACCEPTINVCHARS",
  "ACCESS_KEY_ID",
  "SECRET_ACCESS_KEY",
  "AVRO",
  "BLANKSASNULL",
  "BZIP2",
  "COMPROWS",
  "COMPUPDATE",
  "CREDENTIALS",
  "DATEFORMAT",
  "DELIMITER",
  "EMPTYASNULL",
  "ENCODING",
  "ENCRYPTED",
  "ESCAPE",
  "EXPLICIT_IDS",
  "FILLRECORD",
  "FIXEDWIDTH",
  "FORMAT",
  "IAM_ROLE",
  "GZIP",
  "IGNOREBLANKLINES",
  "IGNOREHEADER",
  "JSON",
  "LZOP",
  "MANIFEST",
  "MASTER_SYMMETRIC_KEY",
  "MAXERROR",
  "NOLOAD",
  "NULL AS",
  "READRATIO",
  "REGION",
  "REMOVEQUOTES",
  "ROUNDEC",
  "SSH",
  "STATUPDATE",
  "TIMEFORMAT",
  "SESSION_TOKEN",
  "TRIMBLANKS",
  "TRUNCATECOLUMNS",
  "EXTERNAL",
  "DATA CATALOG",
  "HIVE METASTORE",
  "CATALOG_ROLE",
  "VACUUM",
  "COPY",
  "UNLOAD",
  "EVEN",
  "ALL",
];

const reservedTopLevelWords = [
  "ADD",
  "AFTER",
  "ALTER COLUMN",
  "ALTER TABLE",
  "DELETE FROM",
  "EXCEPT",
  "FROM",
  "GROUP BY",
  "HAVING",
  "INSERT INTO",
  "INSERT",
  "INTERSECT",
  "TOP",
  "LIMIT",
  "MODIFY",
  "ORDER BY",
  "SELECT",
  "SET CURRENT SCHEMA",
  "SET SCHEMA",
  "SET",
  "UNION ALL",
  "UNION",
  "UPDATE",
  "VALUES",
  "WHERE",
  "VACUUM",
  "COPY",
  "UNLOAD",
  "ANALYZE",
  "ANALYSE",
  "DISTKEY",
  "SORTKEY",
  "COMPOUND",
  "INTERLEAVED",
  "FORMAT",
  "DELIMITER",
  "FIXEDWIDTH",
  "AVRO",
  "JSON",
  "ENCRYPTED",
  "BZIP2",
  "GZIP",
  "LZOP",
  "PARQUET",
  "ORC",
  "ACCEPTANYDATE",
  "ACCEPTINVCHARS",
  "BLANKSASNULL",
  "DATEFORMAT",
  "EMPTYASNULL",
  "ENCODING",
  "ESCAPE",
  "EXPLICIT_IDS",
  "FILLRECORD",
  "IGNOREBLANKLINES",
  "IGNOREHEADER",
  "NULL AS",
  "REMOVEQUOTES",
  "ROUNDEC",
  "TIMEFORMAT",
  "TRIMBLANKS",
  "TRUNCATECOLUMNS",
  "COMPROWS",
  "COMPUPDATE",
  "MAXERROR",
  "NOLOAD",
  "STATUPDATE",
  "MANIFEST",
  "REGION",
  "IAM_ROLE",
  "MASTER_SYMMETRIC_KEY",
  "SSH",
  "ACCEPTANYDATE",
  "ACCEPTINVCHARS",
  "ACCESS_KEY_ID",
  "SECRET_ACCESS_KEY",
  "AVRO",
  "BLANKSASNULL",
  "BZIP2",
  "COMPROWS",
  "COMPUPDATE",
  "CREDENTIALS",
  "DATEFORMAT",
  "DELIMITER",
  "EMPTYASNULL",
  "ENCODING",
  "ENCRYPTED",
  "ESCAPE",
  "EXPLICIT_IDS",
  "FILLRECORD",
  "FIXEDWIDTH",
  "FORMAT",
  "IAM_ROLE",
  "GZIP",
  "IGNOREBLANKLINES",
  "IGNOREHEADER",
  "JSON",
  "LZOP",
  "MANIFEST",
  "MASTER_SYMMETRIC_KEY",
  "MAXERROR",
  "NOLOAD",
  "NULL AS",
  "READRATIO",
  "REGION",
  "REMOVEQUOTES",
  "ROUNDEC",
  "SSH",
  "STATUPDATE",
  "TIMEFORMAT",
  "SESSION_TOKEN",
  "TRIMBLANKS",
  "TRUNCATECOLUMNS",
  "EXTERNAL",
  "DATA CATALOG",
  "HIVE METASTORE",
  "CATALOG_ROLE",
];

const reservedTopLevelWordsNoIndent: string[] = [];

const reservedNewlineWords = [
  "AND",
  "ELSE",
  "OR",
  "OUTER APPLY",
  "WHEN",
  "VACUUM",
  "COPY",
  "UNLOAD",
  "ANALYZE",
  "ANALYSE",
  "DISTKEY",
  "SORTKEY",
  "COMPOUND",
  "INTERLEAVED",
  // joins
  "JOIN",
  "INNER JOIN",
  "LEFT JOIN",
  "LEFT OUTER JOIN",
  "RIGHT JOIN",
  "RIGHT OUTER JOIN",
  "FULL JOIN",
  "FULL OUTER JOIN",
  "CROSS JOIN",
  "NATURAL JOIN",
];

export default class RedshiftFormatter extends Formatter {
  tokenizer() {
    return new Tokenizer({
      reservedWords,
      reservedTopLevelWords,
      reservedNewlineWords,
      reservedTopLevelWordsNoIndent,
      stringTypes: [`""`, "''", "``"],
      openParens: ["("],
      closeParens: [")"],
      indexedPlaceholderTypes: ["?"],
      namedPlaceholderTypes: ["@", "#", "$"],
      lineCommentTypes: ["--"],
      operators: ["|/", "||/", "<<", ">>", "!=", "||"],
    });
  }
}
