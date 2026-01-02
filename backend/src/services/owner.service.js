export async function upsertOwner({ name, mobile }, session) {
  let owner = await Owner.findOne({ mobile }).session(session);

  if (owner) {
    if (owner.name !== name) {
      owner.name = name;
      await owner.save({ session });
    }
    return owner;
  }

  return Owner.create([{ name, mobile }], { session }).then(r => r[0]);
}