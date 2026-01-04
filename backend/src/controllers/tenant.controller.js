import Tenant from '../models/Tenant.js';

export async function createTenant(req, res) {
  try {
    const { name, code, plan } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const existing = await Tenant.findOne({ code });
    if (existing) {
      return res.status(409).json({ message: 'Tenant code already exists' });
    }

    const tenant = await Tenant.create({
      name,
      code,
      plan
    });

    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tenant' });
  }
}

export async function listTenants(req, res) {
  try {
    const tenants = await Tenant.aggregate([
      {
        $lookup: {
          from: 'tenantbillingledgers',
          localField: '_id',
          foreignField: 'tenantId',
          as: 'ledger'
        }
      },
      {
        $addFields: {
          totalCharged: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$ledger',
                    as: 'l',
                    cond: { $eq: ['$$l.type', 'CHARGE'] }
                  }
                },
                as: 'c',
                in: '$$c.amount'
              }
            }
          },
          totalPaid: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$ledger',
                    as: 'l',
                    cond: { $eq: ['$$l.type', 'PAYMENT'] }
                  }
                },
                as: 'p',
                in: '$$p.amount'
              }
            }
          },
          totalAdjusted: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$ledger',
                    as: 'l',
                    cond: { $eq: ['$$l.type', 'ADJUSTMENT'] }
                  }
                },
                as: 'a',
                in: {
                  $cond: [
                    { $eq: ['$$a.direction', 'ADD'] },
                    '$$a.amount',
                    { $multiply: ['$$a.amount', -1] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          duesAmount: {
            $subtract: [
              { $add: ['$totalCharged', '$totalAdjusted'] },
              '$totalPaid'
            ]
          }
        }
      },
      {
        $project: {
          ledger: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tenants with billing' });
  }
}

export async function disableTenant(req, res) {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { isActive: false },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable tenant' });
  }
}

export async function enableTenant(req, res) {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { isActive: true },
      { new: true }
    );

    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to enable tenant' });
  }
}