# Canva Visual Live Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng bộ công cụ Studio biên tập trực quan chuẩn Canva cho website Luxury E-Commerce Showcase với khung chọn Bounding Box 8 điểm neo, tay nắm xoay 360°, thanh công cụ ngữ cảnh nổi, ngăn kéo tài nguyên mẫu, Undo/Redo (`Ctrl+Z`, `Ctrl+Y`) và lưu trữ bền vững vào SQLite.

**Architecture:** Tạo tầng phủ `CanvaOverlay` bao bọc trang web khi bật Live Edit, quản lý mảng đối tượng `canvasElements`, cung cấp khung `CanvaBoundingBox` đa năng (co giãn 8 hướng, xoay 360°), thanh công cụ `CanvaToolbar` thay đổi linh hoạt theo loại đối tượng, ngăn kéo `CanvaDrawer` chèn nhanh chữ/huy hiệu/ảnh, và tích hợp chặt chẽ vào `HomePage.jsx` với cơ chế lưu `specifications.canvas_elements`.

**Tech Stack:** React 18, TailwindCSS, Lucide React, Pointer Events API, HTML5 ContentEditable.

**Spec:** `docs/superpowers/specs/2026-09-26-canva-live-studio-design.md`

## Global Constraints
- Bounding Box có viền xanh `#0071e3`, 8 điểm neo kéo giãn (`nw`, `n`, `ne`, `e`, `se`, `s`, `sw`, `w`) và tay cầm xoay góc tròn phía dưới.
- Xoay 360 độ tự động hút góc (snap) khi gần các góc `0°`, `45°`, `90°`, `180°`, `270°`.
- Hỗ trợ Undo/Redo tối đa 30 bước qua `Ctrl+Z` và `Ctrl+Y` (hoặc `Ctrl+Shift+Z`).
- Phím tắt: `Delete`/`Backspace` để xóa, `Ctrl+D` để nhân bản, các phím Mũi tên để vi chỉnh 1px (Shift + Mũi tên để nhảy 10px).
- Dữ liệu lưu trữ trong `activeProduct.specifications.canvas_elements` qua API `adminApi.updateProduct()`.

---

### Task 1: Xây dựng Thanh Công Cụ Ngữ Cảnh Nổi `CanvaToolbar.jsx`

**Files:**
- Create: `frontend/src/components/common/canva/CanvaToolbar.jsx`

**Interfaces:**
- Consumes:
  - `element: CanvasElement` (chứa `type`, `content`, `style`, `zIndex`)
  - `onUpdateStyle: (stylePatch: object) => void`
  - `onBringForward: () => void`
  - `onSendBackward: () => void`
  - `onDuplicate: () => void`
  - `onDelete: () => void`
- Produces:
  - Component thanh công cụ nổi hiển thị linh hoạt các nút đổi cỡ chữ, bảng màu luxury, in đậm, căn lề, bo góc, độ mờ đục và xếp lớp.

- [ ] **Step 1: Viết component `CanvaToolbar.jsx`**
  - Cung cấp palette màu sắc luxury (Trắng `#ffffff`, Vàng Gold `#ffd700`, Xám Titan `#86868b`, Đen `#111113`, Xanh `#0071e3`, Đỏ `#ff453a`).
  - Hỗ trợ đổi cỡ chữ (input + nút +/-).
  - Hỗ trợ nút Bold, nút căn lề (Trái/Giữa/Phải).
  - Hỗ trợ nút bo góc tròn và độ trong suốt (opacity).
  - Hỗ trợ 3 nút: Lớp hiển thị (Lên/Xuống), Nhân bản, Xóa.

- [ ] **Step 2: Kiểm tra cú pháp JSX của `CanvaToolbar.jsx` bằng build hoặc render test**

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/components/common/canva/CanvaToolbar.jsx
  git commit -m "feat(canva): add CanvaToolbar component"
  ```

---

### Task 2: Xây dựng Khung Chọn Bounding Box `CanvaBoundingBox.jsx`

**Files:**
- Create: `frontend/src/components/common/canva/CanvaBoundingBox.jsx`

**Interfaces:**
- Consumes:
  - `element: CanvasElement`
  - `isSelected: boolean`
  - `isEditMode: boolean`
  - `onSelect: (id: string) => void`
  - `onUpdateTransform: (id: string, patch: { x?: number, y?: number, width?: number, height?: number, rotation?: number }) => void`
  - `onUpdateContent: (id: string, content: string) => void`
  - `onUpdateStyle: (id: string, stylePatch: object) => void`
  - Các hàm xếp lớp, nhân bản, xóa.
- Produces:
  - Component khung viền bao quanh phần tử với 8 điểm neo co giãn, 1 tay cầm xoay góc 360°, tính năng kéo thả mượt mà bằng Pointer Events, và click đúp gõ chữ trực tiếp.

- [ ] **Step 1: Viết logic co giãn 8 hướng (Resize)**
  - Xử lý kéo neo 4 góc (`nw`, `ne`, `se`, `sw`) và 4 cạnh (`n`, `s`, `e`, `w`).
  - Áp dụng `minWidth = 40`, `minHeight = 24`.

- [ ] **Step 2: Viết logic tay cầm xoay 360° (Rotation Handle)**
  - Đặt tay cầm tròn bên dưới khung 24px.
  - Tính góc xoay từ tâm và tự động snap vào các mốc 0, 45, 90, 180, 270 độ nếu lệch < 4 độ.

- [ ] **Step 3: Viết logic chỉnh sửa chữ trực tiếp (Inline Editing)**
  - Double click kích hoạt `contentEditable`.

- [ ] **Step 4: Commit**
  ```bash
  git add frontend/src/components/common/canva/CanvaBoundingBox.jsx
  git commit -m "feat(canva): add CanvaBoundingBox with 8 resize handles and rotation"
  ```

---

### Task 3: Xây dựng Ngăn Kéo Tài Nguyên Mẫu `CanvaDrawer.jsx`

**Files:**
- Create: `frontend/src/components/common/canva/CanvaDrawer.jsx`

**Interfaces:**
- Consumes:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onAddText: (variant: 'h1' | 'h2' | 'body') => void`
  - `onAddBadge: (badgePreset: object) => void`
  - `onAddImage: (file: File) => void`
- Produces:
  - Drawer bên trái màn hình cho phép click chọn mẫu Text, mẫu Huy hiệu sang trọng, hoặc tải ảnh lên từ máy tính.

- [ ] **Step 1: Viết component `CanvaDrawer.jsx`**
  - Tab 1: Văn bản (Tiêu đề lớn H1 36px, Tiêu đề phụ H2 22px, Đoạn văn 15px).
  - Tab 2: Huy hiệu Luxury (6 mẫu: "Limited Edition", "Titanium Frame", "Global Warranty", "Bestseller", "Voucher 20%", "Handcrafted").
  - Tab 3: Tải ảnh (Input upload file kết nối API backend, hoặc chọn ảnh mẫu).

- [ ] **Step 2: Commit**
  ```bash
  git add frontend/src/components/common/canva/CanvaDrawer.jsx
  git commit -m "feat(canva): add CanvaDrawer asset library panel"
  ```

---

### Task 4: Xây dựng Bộ Điều Khiển Trung Tâm `CanvaOverlay.jsx`

**Files:**
- Create: `frontend/src/components/common/canva/CanvaOverlay.jsx`

**Interfaces:**
- Consumes:
  - `elements: CanvasElement[]`
  - `onChangeElements: (newElements: CanvasElement[]) => void`
  - `isEditMode: boolean`
  - `isDrawerOpen: boolean`
  - `onCloseDrawer: () => void`
- Produces:
  - Quản lý mảng phần tử, ngăn xếp Undo/Redo (`historyStack`, `redoStack`), phím tắt toàn cục (`Ctrl+Z`, `Ctrl+Y`, `Ctrl+D`, `Delete`, phím mũi tên).

- [ ] **Step 1: Viết hook quản lý Undo/Redo Stack**
  - Lưu tối đa 30 snapshot.
  - Lắng nghe sự kiện `keydown` bắt phím `Ctrl+Z`, `Ctrl+Y`.

- [ ] **Step 2: Viết logic click outside và phím tắt thao tác nhanh**
  - `Delete`/`Backspace` xóa phần tử đang chọn.
  - `Ctrl+D` nhân bản phần tử đang chọn.
  - Mũi tên dịch 1px (Shift + mũi tên dịch 10px).

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/components/common/canva/CanvaOverlay.jsx
  git commit -m "feat(canva): add CanvaOverlay with undo-redo and keyboard shortcuts"
  ```

---

### Task 5: Tích hợp Canva Studio vào `HomePage.jsx` và `LiveEditorBar.jsx`

**Files:**
- Modify: `frontend/src/components/navbar/LiveEditorBar.jsx`
- Modify: `frontend/src/pages/HomePage.jsx`

**Interfaces:**
- Consumes:
  - `CanvaOverlay`, `CanvaDrawer`
  - `activeProduct.specifications.canvas_elements`
- Produces:
  - Nút bật/tắt Canva Drawer, nút Undo/Redo trên `LiveEditorBar`.
  - Kết nối dữ liệu `canvasElements` với hàm `handleSaveLive` để lưu vĩnh viễn vào SQLite.

- [ ] **Step 1: Cập nhật `LiveEditorBar.jsx`**
  - Thêm nút `🎨 Mở Canva Studio` mở Drawer.
  - Thêm 2 nút `↶ Hoàn tác (Ctrl+Z)` và `↷ Làm lại (Ctrl+Y)`.

- [ ] **Step 2: Cập nhật `HomePage.jsx`**
  - Khởi tạo `canvasElements` từ `activeProduct.specifications?.canvas_elements || []`.
  - Nhúng `<CanvaOverlay />` và `<CanvaDrawer />`.
  - Lưu `canvas_elements: canvasElements` trong payload của `handleSaveLive`.

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/components/navbar/LiveEditorBar.jsx frontend/src/pages/HomePage.jsx
  git commit -m "feat(canva): integrate Canva studio and persistence into HomePage"
  ```

---

### Task 6: Kiểm Thử Toàn Diện và Build Kiểm Định

**Files:**
- Test & Verify:
  - `npm run build` ở thư mục `frontend`
  - `pytest` ở thư mục `backend`

- [ ] **Step 1: Chạy `npm run build` để kiểm tra compile không có lỗi cú pháp JSX/CSS**
- [ ] **Step 2: Chạy `pytest` backend để đảm bảo các API product và admin vẫn hoạt động 100%**
- [ ] **Step 3: Mở trình duyệt và kiểm tra thao tác thực tế: tạo Text/Badge, co giãn 8 góc, xoay góc, Undo/Redo và lưu lên database**
- [ ] **Step 4: Commit hoàn tất**
  ```bash
  git commit -m "chore(canva): verify end-to-end Canva live editor system"
  ```
