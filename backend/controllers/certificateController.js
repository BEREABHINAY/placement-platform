import Certificate from "../models/Certificate.js";

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate("course", "title category")
      .sort({ issuedAt: -1 });
    res.json({ success: true, certificates });
  } catch (err) {
    next(err);
  }
};

// Public endpoint — anyone with a certificate ID (e.g. a recruiter) can verify authenticity
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate("user", "name")
      .populate("course", "title category level");
    if (!certificate) {
      return res.status(404).json({ success: false, message: "No certificate found with this ID." });
    }
    res.json({ success: true, certificate });
  } catch (err) {
    next(err);
  }
};

// Admin only
export const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ issuedAt: -1 });
    res.json({ success: true, count: certificates.length, certificates });
  } catch (err) {
    next(err);
  }
};
