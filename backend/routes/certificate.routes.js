const router = require("express").Router();
const PDFDocument = require("pdfkit");
const auth = require("../middleware/auth.middleware");
const Test = require("../models/Test");
const Result = require("../models/Result");

router.get("/:testId", auth, async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user.id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ msg: "Test not found" });

    // Leaderboard (tie-breaker: faster submit wins)
    const results = await Result.find({ testId })
      .populate("studentId", "name")
      .sort({ score: -1, submittedAt: 1 });

    const rank =
      results.findIndex(
        r => r.studentId._id.toString() === studentId
      ) + 1;

    if (rank < 1 || rank > 3) {
      return res.status(403).json({ msg: "Certificate not available" });
    }

    const studentName = results[rank - 1].studentId.name;

    // 🧾 PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${test.title}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    /* ===== CERTIFICATE DESIGN ===== */

    // Border
    doc
      .rect(20, 20, 555, 802)
      .lineWidth(3)
      .stroke("#333");

    doc.moveDown(2);

    // Title
    doc
      .fontSize(28)
      .font("Times-Bold")
      .text("Certificate of Achievement", { align: "center" });

    doc.moveDown(2);

    // Body
    doc.fontSize(14).font("Times-Roman").text(
      "This is proudly presented to",
      { align: "center" }
    );

    doc.moveDown(1);

    // Student Name
    doc
      .fontSize(22)
      .font("Times-Bold")
      .text(studentName, { align: "center" });

    doc.moveDown(1);

    // Rank
    const rankText =
      rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd";

    doc.fontSize(14).font("Times-Roman").text(
      `for securing ${rankText} position`,
      { align: "center" }
    );

    doc.moveDown(1);

    // Test Info
    doc.text(
      `in the test "${test.title}"`,
      { align: "center" }
    );

    doc.moveDown(1);

    doc.text(
      `Conducted on ${new Date(test.endTime).toDateString()}`,
      { align: "center" }
    );

    doc.moveDown(3);

    // Footer
    doc
      .fontSize(12)
      .text("Issued by", { align: "center" });

    doc
      .fontSize(14)
      .font("Times-Bold")
      .text("Your College Name", { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(10)
      .text("This certificate is system generated.", {
        align: "center",
        opacity: 0.7
      });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
