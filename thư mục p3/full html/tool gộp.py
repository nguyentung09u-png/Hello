import os

def gop_file_thanh_txt():
    # Nhập đường dẫn thư mục
    thu_muc = input("Nhập đường dẫn thư mục: ").strip()
    
    # Kiểm tra thư mục tồn tại
    if not os.path.isdir(thu_muc):
        print(f"❌ Thư mục không tồn tại: {thu_muc}")
        return
    
    # Lấy tên file output
    ten_output = input("Nhập tên file output (mặc định: gop.txt): ").strip()
    if not ten_output:
        ten_output = "gop.txt"
    if not ten_output.endswith(".txt"):
        ten_output += ".txt"
    
    duong_dan_output = os.path.join(thu_muc, ten_output)
    
    # Lấy danh sách file (chỉ file, không lấy thư mục con)
    danh_sach_file = []
    for ten in sorted(os.listdir(thu_muc)):
        duong_dan_day_du = os.path.join(thu_muc, ten)
        if os.path.isfile(duong_dan_day_du) and duong_dan_day_du != duong_dan_output:
            danh_sach_file.append(ten)
    
    if not danh_sach_file:
        print("⚠️  Không có file nào trong thư mục!")
        return
    
    print(f"\n📂 Tìm thấy {len(danh_sach_file)} file:")
    for f in danh_sach_file:
        print(f"   • {f}")
    
    # Gộp nội dung
    thanh_cong = 0
    with open(duong_dan_output, "w", encoding="utf-8") as out:
        for ten_file in danh_sach_file:
            duong_dan = os.path.join(thu_muc, ten_file)
            try:
                with open(duong_dan, "r", encoding="utf-8", errors="ignore") as f:
                    noi_dung = f.read()
                
                # Format đẹp
                out.write("=" * 70 + "\n")
                out.write(f"📄 FILE: {ten_file}\n")
                out.write("=" * 70 + "\n")
                out.write(noi_dung)
                if not noi_dung.endswith("\n"):
                    out.write("\n")
                out.write("\n\n")
                
                thanh_cong += 1
                print(f"   ✅ Đã gộp: {ten_file}")
            except Exception as e:
                print(f"   ❌ Lỗi đọc {ten_file}: {e}")
    
    print(f"\n🎉 Hoàn thành! Đã gộp {thanh_cong}/{len(danh_sach_file)} file")
    print(f"📁 File output: {duong_dan_output}")


if __name__ == "__main__":
    gop_file_thanh_txt()