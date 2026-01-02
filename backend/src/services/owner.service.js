import Owner from '../models/Owner.js';

export async function upsertOwner({ name, mobile }) {
  let owner = await Owner.findOne({ mobile });

  if (owner) {
    if (owner.name !== name) {
      owner.name = name;
      await owner.save();
    }
    return owner;
  }

  return Owner.create({ name, mobile });
}
