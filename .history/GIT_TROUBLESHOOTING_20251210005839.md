# Hướng Dẫn Khắc Phục Các Lỗi Git

## 1. Lỗi: File Quá Lớn (Exceeds GitHub's File Size Limit)

### Triệu chứng

```
File phone-app/node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node is 141.30 MB
this exceeds GitHub's file size limit of 100.00 MB
GH001: Large files detected
```

### Nguyên nhân

- File `.node` hoặc các file binary vượt quá 100 MB
- `node_modules/` được commit vô tình
- Git cache chứa file lớn từ commit cũ

### Giải Pháp

#### Bước 1: Unstage commit gần nhất

```bash
git reset HEAD~1
```

#### Bước 2: Loại bỏ node_modules khỏi Git cache

```bash
git rm -r --cached phone-app/node_modules backend/node_modules
```

#### Bước 3: Làm sạch toàn bộ Git history (QUAN TRỌNG)

```bash
git filter-branch --tree-filter 'find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true' --force HEAD
```

**Giải thích:**

- `--tree-filter` xử lý mỗi commit trong history
- `find . -type d -name node_modules` tìm tất cả thư mục node_modules
- `-exec rm -rf {} +` xóa chúng
- `--force` bỏ qua các cảnh báo

#### Bước 4: Force push lên GitHub

```bash
git push origin main -f
```

### Kết quả

- Repository size giảm đáng kể (ví dụ: 170 MB → 15 MB)
- File lớn bị xóa hoàn toàn khỏi history
- Push thành công

---

## 2. Lỗi: Submodule (Converting Submodules to Regular Directories)

### Triệu chứng

```
warning: adding embedded git repository: backend
warning: adding embedded git repository: phone-app
modified: backend (modified content, untracked content)
modified: phone-app (modified content, untracked content)
```

### Nguyên nhân

- Thư mục `backend/` và `phone-app/` được cấu hình là Git submodules
- Git vẫn lưu submodule metadata trong `.git/modules/`
- File `.gitmodules` định nghĩa các submodules

### Giải Pháp

#### Bước 1: Xóa embedded `.git` folders

```bash
Remove-Item -Path "backend\.git" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "phone-app\.git" -Recurse -Force -ErrorAction SilentlyContinue
```

#### Bước 2: Xóa Git submodule metadata

```bash
Remove-Item -Path ".git\modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".gitmodules" -Force -ErrorAction SilentlyContinue
```

#### Bước 3: Xóa lock file (nếu có)

```bash
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue
```

#### Bước 4: Xóa và regenerate Git index

```bash
Remove-Item -Path ".git\index" -Recurse -Force -ErrorAction SilentlyContinue
git reset --hard
```

#### Bước 5: Kiểm tra kết quả

```bash
git status
```

**Kết quả mong đợi:**

```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .github/
        backend/
        phone-app/
```

#### Bước 6: Commit và push

```bash
git add -A
git commit -m "Convert submodules to regular directories"
git push origin main
```

### Cách Xử Lý Khi Bị Submodule (Advanced)

Nếu submodule vẫn còn ở trong `.git/config` hoặc không thể xóa hoàn toàn:

#### Xóa submodule từ config

```bash
git config --file .gitmodules --remove-section submodule.backend
git config --file .gitmodules --remove-section submodule.phone-app
git add .gitmodules
git commit -m "Remove submodule entries from gitmodules"
```

#### Xóa từ local git config

```bash
git config --remove-section submodule.backend
git config --remove-section submodule.phone-app
```

#### Nếu vẫn có reference đến submodule

```bash
# Kiểm tra
git config --list | grep submodule

# Xóa nếu vẫn còn
git config --global --remove-section submodule.backend
git config --global --remove-section submodule.phone-app
```

#### Làm sạch Git cache và history

```bash
# Xóa reference khỏi history
git filter-branch --tree-filter 'rm -rf .gitmodules' --force HEAD

# Garbage collection để giải phóng space
git gc --aggressive
git reflog expire --expire=now --all
git fsck --full --unreachable
```

#### Kiểm tra xem submodule có còn không

```bash
cat .git/config | grep -i submodule
```

**Nếu vẫn thấy submodule:**

```bash
# Force remove khỏi .git/config
git config --global core.worktree false

# Hoặc edit trực tiếp file
# Windows: Mở file D:\Work\newpro\.git\config
# Xóa tất cả dòng có [submodule "..."] và cách mục liên quan
```

#### Full reset nếu tất cả cách trên không hiệu quả

```bash
# Backup repo hiện tại
Copy-Item -Path "D:\Work\newpro" -Destination "D:\Work\newpro.backup" -Recurse

# Reset git
cd D:\Work\newpro
Remove-Item -Path ".git" -Recurse -Force
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Re-add everything
git add .
git commit -m "Reinitialize repository without submodules"
git remote add origin https://github.com/huyshelby/tesst.git
git push -u origin main -f
```

---

## 3. Lỗi: CRLF vs LF Line Endings

### Triệu chứng

```
warning: in the working copy of 'file.ts', LF will be replaced by CRLF the next time Git touches it
```

### Nguyên nhân

- Khác biệt line ending giữa Windows (CRLF) và Unix/Linux (LF)
- Git cảnh báo sẽ convert line endings

### Giải Pháp

#### Tùy chọn 1: Để Git tự convert (Khuyến nghị cho Windows)

```bash
git config --global core.autocrlf true
```

#### Tùy chọn 2: Không convert (Khuyến nghị cho dự án đa nền tảng)

```bash
git config --global core.autocrlf false
```

#### Tùy chọn 3: Normalize tất cả files

```bash
git add --renormalize -A
git commit -m "Normalize line endings"
```

---

## 4. Hướng Dẫn Setup Lần Đầu (Best Practices)

### Thứ tự chính xác:

#### 1. Tạo `.gitignore` TRƯỚC COMMIT ĐẦU

```bash
# Tạo .gitignore
cat > .gitignore << 'EOF'
node_modules/
.next/
dist/
build/
.DS_Store
*.log
.env.local
EOF
```

#### 2. Khởi tạo Git repo

```bash
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

#### 3. Thêm tất cả files (gitignore sẽ exclude)

```bash
git add .
```

#### 4. Commit đầu tiên

```bash
git commit -m "Initial commit"
```

#### 5. Thêm remote và push

```bash
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main
```

---

## 5. Useful Git Commands

### Kiểm tra Git status

```bash
git status
git log --oneline
git show-ref
```

### Xóa file khỏi Git (nhưng giữ file)

```bash
git rm --cached filename
git rm -r --cached foldername/
```

### Reset commit

```bash
git reset HEAD~1          # Undo last commit, keep changes
git reset --hard HEAD~1   # Undo last commit, discard changes
```

### Force push (CẨN THẬN!)

```bash
git push origin main -f   # Force push main branch
```

### Clean Git cache

```bash
git gc --aggressive
git reflog expire --expire=now --all
git fsck --full --unreachable
```

---

## 6. Checklist Để Tránh Lỗi

- [ ] Tạo `.gitignore` TRƯỚC commit đầu tiên
- [ ] Include: `node_modules/`, `dist/`, `.build/`, `.next/`
- [ ] Không commit large files (> 100 MB)
- [ ] Không commit credentials hoặc `.env`
- [ ] Kiểm tra `git status` trước khi push
- [ ] Xóa submodules nếu không cần
- [ ] Setup `.editorconfig` cho line ending consistency
- [ ] Dùng `git diff --cached` để review trước commit

---

## 7. Khi Gặp Lỗi - Emergency Fix

```bash
# 1. Kiểm tra status
git status

# 2. Xóa tất cả uncommitted changes
git reset --hard HEAD

# 3. Xóa untracked files
git clean -fd

# 4. Kiểm tra remote
git remote -v

# 5. Fetch latest
git fetch origin

# 6. Rebase (nếu có conflict)
git rebase origin/main

# 7. Push lại
git push origin main -u
```

---

## 📚 Tham khảo

- [Git Official Docs](https://git-scm.com/doc)
- [GitHub Help](https://docs.github.com)
- [Git Large File Storage](https://git-lfs.github.com)
- [EditorConfig](https://editorconfig.org)
