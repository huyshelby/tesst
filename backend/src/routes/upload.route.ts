import { Router } from "express";
import { upload } from "../middlewares/upload";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Upload single image
router.post("/image", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Không có file nào được upload",
    });
  }

  // Trả về URL của ảnh (lưu vào pictures/uploaded thay vì uploads)
  const imageUrl = `/pictures/uploaded/${req.file.filename}`;

  res.json({
    success: true,
    data: {
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

// Upload multiple images
router.post("/images", requireAuth, upload.array("images", 10), (req, res) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Không có file nào được upload",
    });
  }

  const imageUrls = files.map((file) => ({
    url: `/pictures/uploaded/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  }));

  res.json({
    success: true,
    data: imageUrls,
  });
});

// Error handler cho multer
router.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next(err);
});

export default router;
