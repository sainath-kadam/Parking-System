import Driver from '../models/Driver.js';

export async function upsertDriver({ name, mobile }, session) {
  let driver = await Driver.findOne({ mobile }).session(session);

  if (driver) {
    if (driver.name !== name) {
      driver.name = name;
      await driver.save({ session });
    }
    return driver;
  }

  const [created] = await Driver.create([{ name, mobile }], { session });
  return created;
}