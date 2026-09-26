# Thiết kế Kiến trúc Studio Biên Tập Trực Quan Chuẩn Canva (Canva Visual Live Editor)

**Ngày lập**: 2026-09-26  
**Dự án**: Luxury E-Commerce Showcase  
**Mục tiêu**: Nâng cấp toàn diện chế độ Live Editing của website thành một Studio thiết kế trực quan WYSIWYG chuẩn Canva/Figma, hỗ trợ Bounding Box 8 điểm neo, xoay góc 360°, thanh định dạng chữ/ảnh nổi, ngăn kéo tài nguyên mẫu, Undo/Redo và phím tắt bàn phím.

---

## 1. Mục tiêu & Phạm vi (Goals & Scope)

### 1.1 Mục tiêu chính
* Cung cấp trải nghiệm chỉnh sửa trực quan tự do như Canva trực tiếp trên giao diện website đang hoạt động.
* Hỗ trợ khung viền tương tác (**Bounding Box**) chuẩn Canva viền xanh `#0071e3`, 8 điểm kéo co giãn (`nw`, `n`, `ne`, `e`, `se`, `s`, `sw`, `w`) và tay nắm xoay góc 360° có tính năng hút góc tự động (snap angle).
* Thanh công cụ ngữ cảnh nổi (**Contextual Floating Toolbar**) tự động chuyển đổi theo loại đối tượng (Văn bản, Huy hiệu, Hình ảnh) với các chức năng chỉnh màu sắc, cỡ chữ, font weight, căn lề, bo góc, độ mờ đục và xếp lớp (Z-index).
* Ngăn kéo tài nguyên (**Canva Asset Drawer**) chèn nhanh các thành phần: Tiêu đề lớn (H1), Tiêu đề phụ (H2), Đoạn văn, Huy hiệu luxury (Badges/Pills) và Hình ảnh từ máy tính hoặc bộ sưu tập.
* Quản lý lịch sử chỉnh sửa với tính năng Hoàn tác/Làm lại (**Undo/Redo** - `Ctrl+Z`, `Ctrl+Y`) và bộ phím tắt thao tác nhanh (`Delete`, `Ctrl+D`, phím mũi tên vi chỉnh tọa độ).
* Dữ liệu được lưu trữ trực tiếp và bền vững vào cơ sở dữ liệu SQLite (`specifications.canvas_elements`), hỗ trợ đa ngôn ngữ và tải lại nguyên trạng.

---

## 2. Kiến trúc Thành phần (Component Architecture)

```
┌────────────────────────────────────────────────────────────────────────┐
│                              HomePage.jsx                              │
│                                                                        │
│  ┌─────────────────────── CanvaOverlay.jsx ─────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌── CanvaBoundingBox.jsx ────────────────────────────────────┐  │  │
│  │  │  [CanvaToolbar.jsx] (Contextual: Text / Badge / Image)    │  │  │
│  │  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Canvas Element: Text / Custom Badge / Image        │  │  │  │
│  │  │  └─────────────────────────────────────────────────────┘  │  │  │
│  │  │  [8 Resize Handles] (NW, N, NE, E, SE, S, SW, W)           │  │  │
│  │  │  [Rotation Handle] (360° with snap 0°, 45°, 90°, 180°...) │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                  │  │
│  │  ┌── CanvaDrawer.jsx ─────────────────────────────────────────┐  │  │
│  │  │  [Thêm Văn Bản] [Thêm Huy Hiệu Sang Trọng] [Tải Lên Ảnh]  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌── LiveEditorBar.jsx (Cập nhật nút Mở Drawer, Undo/Redo, Lưu) ────┐  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Chi tiết các Component
1. **`CanvaOverlay.jsx`**:
   * Quản lý toàn bộ vòng đời tương tác của các đối tượng Canvas tự do trên trang khi `isEditMode = true`.
   * Lắng nghe sự kiện click trên toàn trang: nếu click ngoài Bounding Box thì hủy chọn (`selectedId = null`).
   * Lắng nghe phím tắt toàn cục (`keydown`): `Ctrl+Z`, `Ctrl+Y`, `Ctrl+D`, `Delete`, `Arrow Keys`.
   * Quản lý ngăn xếp lịch sử hoàn tác (`historyStack`, `redoStack`).
2. **`CanvaBoundingBox.jsx`**:
   * Khung viền xanh Canva viền đứt nét/viền sáng bao quanh phần tử đang chọn.
   * 8 nút neo hình vuông trắng bo viền xanh ở 4 góc và 4 cạnh. Khi kéo các neo này, phần tử thay đổi `width`, `height`, `x`, `y` tương ứng.
   * Tay cầm xoay góc tròn ở phía dưới cách đáy 24px: tính toán góc dựa trên `Math.atan2(e.clientY - centerY, e.clientX - centerX)`.
   * Click đúp vào phần tử văn bản để kích hoạt gõ chữ trực tiếp (`contentEditable`).
3. **`CanvaToolbar.jsx`**:
   * Neo động ở trên đỉnh phần tử được chọn, tự động lật xuống dưới nếu phần tử nằm quá sát mép trên màn hình.
   * Hỗ trợ thanh chọn màu chuyên nghiệp (Color Picker với palette sang trọng: Trắng, Xám Titan, Vàng Gold, Xanh Navy, Đỏ Ruby, v.v.).
   * Hỗ trợ đổi cỡ chữ, in đậm, bo góc viền, độ mờ đục (opacity).
   * Bộ 3 nút thao tác nhanh: `Lớp hiển thị` (Lên trên / Xuống dưới), `Nhân bản` (Duplicate), `Xóa bỏ` (Trash).
4. **`CanvaDrawer.jsx`**:
   * Bảng trượt bên trái (hoặc popup thanh lịch):
     * *Văn bản*: Tiêu đề H1 Display, Tiêu đề phụ H2, Đoạn văn bản Body.
     * *Huy hiệu Luxury*: "Limited Edition", "Titanium Aerospace", "Bảo Hành Toàn Cầu", "Best Seller 2026", "Ưu Đãi Đặc Quyền".
     * *Hình ảnh*: Tải từ máy tính (tự động qua API `/api/v1/admin/upload`), chọn ảnh mẫu sản phẩm.
5. **`LiveEditorBar.jsx` (Nâng cấp)**:
   * Tích hợp nút `↶ Hoàn tác` (Undo) và `↷ Làm lại` (Redo).
   * Tích hợp nút `Studio Canva` để bật/tắt Drawer tài nguyên mẫu.

---

## 3. Cấu trúc Mô hình Dữ liệu (Data Model)

Mỗi phần tử Canvas được định nghĩa theo cấu trúc JSON:
```typescript
interface CanvasElement {
  id: string; // "canva-{timestamp}"
  type: "text" | "badge" | "image";
  x: number; // Tọa độ X tương đối (px)
  y: number; // Tọa độ Y tương đối (px)
  width: number; // Chiều rộng (px)
  height?: number; // Chiều cao (px, tùy chọn hoặc tự động theo nội dung)
  rotation: number; // Góc xoay (độ: 0 - 360)
  zIndex: number; // Thứ tự lớp hiển thị (ví dụ: 30 - 60)
  content: string; // Nội dung văn bản hoặc URL hình ảnh
  style: {
    fontSize?: number; // Cỡ chữ (px)
    color?: string; // Mã màu chữ hex/rgba
    fontWeight?: "normal" | "medium" | "semibold" | "bold";
    textAlign?: "left" | "center" | "right";
    backgroundColor?: string; // Màu nền (rgba hoặc hex)
    borderRadius?: number; // Bo góc (px)
    border?: string; // Viền CSS (ví dụ: "1px solid rgba(255,255,255,0.2)")
    opacity?: number; // Độ trong suốt (0.1 - 1.0)
    padding?: string; // Đệm trong CSS
  };
}
```

### 3.1 Vị trí lưu trữ Database
* Toàn bộ mảng `canvasElements` được lưu trữ bên trong trường JSON `specifications.canvas_elements` của bảng `product_translations` trong SQLite `showcase.db`.
* Khi người dùng nhấn **`Lưu Lên Web`**, API `adminApi.updateProduct()` cập nhật trực tiếp vào cơ sở dữ liệu.

---

## 4. Hành vi Tương tác & Trải nghiệm Người dùng (UX Interaction)

1. **Chọn & Bỏ chọn (Select & Deselect)**:
   * Click chuột vào bất kỳ phần tử canvas nào -> Kích hoạt Bounding Box và hiện Toolbar ngữ cảnh.
   * Click vào vùng trống bên ngoài -> Hủy kích hoạt Bounding Box.
2. **Kéo thả di chuyển (Smooth Drag)**:
   * Giữ chuột trên vùng thân đối tượng hoặc thanh tay nắm và rê chuột.
   * Sử dụng Pointer Events (`setPointerCapture`) để đảm bảo không bị giật lag, không bị ghost-drag của trình duyệt.
3. **Co giãn 8 hướng (8-Point Resize)**:
   * Kéo các góc (`nw`, `ne`, `se`, `sw`) thay đổi cả chiều ngang và chiều dọc.
   * Kéo các cạnh (`n`, `s`, `e`, `w`) thay đổi chiều tương ứng.
   * Giới hạn kích thước tối thiểu: `minWidth: 40px`, `minHeight: 24px`.
4. **Xoay góc 360° (Rotate)**:
   * Giữ nút xoay tròn và kéo chuột tạo góc quay.
   * Tự động hút góc (snap) khi góc xoay cách các mốc `0°`, `45°`, `90°`, `180°`, `270°` dưới 4 độ.
5. **Chỉnh sửa văn bản trực tiếp (Double-click Text Edit)**:
   * Click đúp vào phần tử chữ -> chuyển sang `contentEditable`.
   * Gõ nội dung bình thường, tự động cập nhật độ rộng nếu ở chế độ tự co giãn.
6. **Quản lý Lớp (Layering / Z-Index)**:
   * `Đưa lên lớp trên` (Bring Forward): Tăng `zIndex + 1`.
   * `Hạ xuống lớp dưới` (Send Backward): Giảm `zIndex - 1` (tối thiểu 30).
7. **Undo / Redo & Phím tắt**:
   * Mỗi thao tác kéo, co giãn, xoay, sửa chữ, xóa hoặc nhân bản sẽ ghi lại 1 snapshot vào `historyStack`.
   * Nhấn `Ctrl + Z`: Khôi phục trạng thái trước đó.
   * Nhấn `Ctrl + Y` (hoặc `Ctrl + Shift + Z`): Thực hiện lại thao tác vừa hủy.
   * Nhấn `Delete`: Xóa phần tử đang chọn.
   * Nhấn `Ctrl + D`: Nhân bản phần tử đang chọn.
   * Phím Mũi tên: Dịch chuyển vi mô 1px (giữ `Shift` dịch 10px).

---

## 5. Kế hoạch Kiểm thử & Tiêu chí Nghiệm thu (Acceptance Criteria)

* [ ] Tạo mới thành công Text, Badge, Image từ Canva Drawer và hiển thị mượt mà trên website.
* [ ] Khung Bounding Box hiển thị chuẩn xác viền xanh, 8 điểm neo co giãn hoạt động trơn tru theo mọi hướng.
* [ ] Nút xoay 360° hoạt động mượt mà và tự động hút vào góc 0°, 90°, 180°.
* [ ] Thanh công cụ ngữ cảnh nổi hiển thị đúng tính năng tương ứng với đối tượng đang chọn (đổi màu, cỡ chữ, bo góc, xếp lớp).
* [ ] Phím tắt `Ctrl+Z`, `Ctrl+Y`, `Ctrl+D`, `Delete`, phím mũi tên hoạt động chuẩn xác.
* [ ] Nhấn **`Lưu Lên Web`** lưu toàn bộ các phần tử Canvas vào SQLite và khi tải lại trang web (F5), toàn bộ thiết kế vẫn giữ nguyên vẹn vị trí, góc xoay và màu sắc.
