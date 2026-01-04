import Tenant from '../models/Tenant.js';
import TenantBillingLedger from '../models/TenantBillingLedger.js';

function getNextBillingDate(current, cycle) {
  const date = new Date(current);

  if (cycle === 'MONTHLY') date.setMonth(date.getMonth() + 1);
  if (cycle === 'QUARTERLY') date.setMonth(date.getMonth() + 3);
  if (cycle === 'HALF_YEARLY') date.setMonth(date.getMonth() + 6);
  if (cycle === 'YEARLY') date.setFullYear(date.getFullYear() + 1);

  return date;
}

export async function runBillingJob(systemUserId) {
  const today = new Date();

  const tenants = await Tenant.find({
    isActive: true,
    'billing.nextBillingDate': { $lte: today }
  });

  for (const tenant of tenants) {
    const { planAmount, billingCycle, nextBillingDate, duesAmount } = tenant.billing;

    await TenantBillingLedger.create({
      tenantId: tenant._id,
      type: 'CHARGE',
      amount: planAmount,
      cycle: billingCycle,
      periodStart: nextBillingDate,
      periodEnd: today,
      createdBy: systemUserId
    });

    tenant.billing.duesAmount = duesAmount + planAmount;
    tenant.billing.nextBillingDate = getNextBillingDate(nextBillingDate, billingCycle);

    await tenant.save();
  }
}