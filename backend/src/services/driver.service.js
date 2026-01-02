import Driver from '../models/Driver.js';

export async function upsertDriver({ name, mobile }) {
  let driver = await Driver.findOne({ mobile });

  if (driver) {
    if (driver.name !== name) {
      driver.name = name;
      await driver.save();
    }
    return driver;
  }

  return Driver.create({ name, mobile });
}
