import { createObjectCsvWriter } from 'csv-writer';

export async function exportToCSV(filePath, headers, records) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers
  });

  await csvWriter.writeRecords(records);
}
