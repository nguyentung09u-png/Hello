import os

# Nhập đường dẫn gốc
path = input("Nhập đường dẫn tới thư mục: ").strip()

# Nhập khoảng số cho thư mục "background"
start = int(input("Từ số: "))
end   = int(input("Đến số: "))

# Tạo thư mục gốc nếu chưa có
os.makedirs(path, exist_ok=True)

# Tạo các thư mục "background 1", "background 2", ...
for i in range(start, end + 1):
    folder_name = f"background {i}"
    folder_path = os.path.join(path, folder_name)
    os.makedirs(folder_path, exist_ok=True)

    # Trong mỗi "background i" tạo 1 file .txt (tên trống)
    file_path = os.path.join(folder_path, ".txt")
    open(file_path, "w").close()

print(f"Đã tạo {end - start + 1} thư mục, mỗi thư mục có 1 file .txt")