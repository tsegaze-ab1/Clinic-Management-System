const asyncHandler = require("../utils/asyncHandler");
const { getBillingSummary } = require("../services/billingService");

const getBillingReport = asyncHandler(async (req, res) => {
  const summary = await getBillingSummary();

  res.status(200).json({
    success: true,
    message: "Billing summary fetched successfully",
    data: summary
  });
});

module.exports = {
  getBillingReport
};
