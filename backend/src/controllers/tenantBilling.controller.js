import Tenant from '../models/Tenant.js';
import TenantBillingLedger from '../models/TenantBillingLedger.js';
import TenantBillingLog from '../models/TenantBillingLog.js';

export async function addTenantPayment(req, res) {
  try {
    const { tenantId } = req.params;
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    await TenantBillingLedger.create({
      tenantId,
      type: 'PAYMENT',
      amount,
      direction: 'SUBTRACT',
      reference,
      createdBy: req.user.userId
    });

    tenant.billing.duesAmount = Math.max(0, tenant.billing.duesAmount - amount);
    await tenant.save();

    await TenantBillingLog.create({
      tenantId,
      action: 'PAYMENT_RECORDED',
      amount,
      balanceAfter: tenant.billing.duesAmount,
      note: reference,
      performedBy: req.user.userId
    });

    res.json({
      message: 'Payment recorded',
      duesAmount: tenant.billing.duesAmount
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record payment' });
  }
}

export async function applyAdjustment(req, res) {
  try {
    const { tenantId } = req.params;
    const { amount, direction, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!['ADD', 'SUBTRACT'].includes(direction)) {
      return res.status(400).json({ message: 'Invalid adjustment direction' });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    await TenantBillingLedger.create({
      tenantId,
      type: 'ADJUSTMENT',
      amount,
      direction,
      reference: note,
      createdBy: req.user.userId
    });

    if (direction === 'ADD') tenant.billing.duesAmount += amount;
    if (direction === 'SUBTRACT') tenant.billing.duesAmount = Math.max(0, tenant.billing.duesAmount - amount);

    await TenantBillingLog.create({
      tenantId,
      action: 'ADJUSTMENT_APPLIED',
      amount,
      balanceAfter: tenant.billing.duesAmount,
      note,
      performedBy: req.user.userId
    });

    await tenant.save();

    res.json({
      message: 'Adjustment applied',
      duesAmount: tenant.billing.duesAmount
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply adjustment' });
  }
}