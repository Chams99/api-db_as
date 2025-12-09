
const sqlStatements = [
    // Issue 1: Multiline WHERE ignored?
    `SELECT *
FROM items
WHERE price < 50
LIMIT 100;`,

    // Issue 2: Distinct failed
    `SELECT DISTINCT category FROM items LIMIT 100;`,

    // Issue 3: Multiline extraction
    `SELECT * FROM items WHERE rating > 4.0;`
];

async function parseAndExecuteSQL(sql) {
    const cleanSQL = sql.replace(/;+$/, '').trim();
    const upperSQL = cleanSQL.toUpperCase();

    console.log('\n--- Parsing ---');
    console.log(JSON.stringify(cleanSQL));

    // Extract table name
    const fromMatch = cleanSQL.match(/FROM\s+(\w+)/i);
    console.log('From Match:', fromMatch ? fromMatch[1] : 'null');

    // Test Select matching (Original)
    // const selectMatch = cleanSQL.match(/SELECT\s+(.*?)\s+FROM/i);
    // console.log('Select Match (Original):', selectMatch ? selectMatch[1] : 'null');

    // Test Select matching (Proposed fix)
    const selectMatch = cleanSQL.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
    console.log('Select Match (Fix):', selectMatch ? selectMatch[1] : 'null');

    // Test Where matching (Original)
    const whereMatchOriginal = cleanSQL.match(/WHERE\s+(.*?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
    console.log('Where Match (Original):', whereMatchOriginal ? whereMatchOriginal[1] : 'null');

    // Test Where matching (Proposed fix)
    const whereMatchFix = cleanSQL.match(/WHERE\s+([\s\S]*?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
    console.log('Where Match (Fix):', whereMatchFix ? whereMatchFix[1] : 'null');

}

sqlStatements.forEach(sql => parseAndExecuteSQL(sql));
