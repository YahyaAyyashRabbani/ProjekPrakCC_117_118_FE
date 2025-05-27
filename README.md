#Frontend - Anime Review App
Berikut adalah daftar halaman (route) dan fitur otentikasi yang digunakan pada aplikasi frontend Anime Review berbasis React:

## Routing
Path	Komponen	Deskripsi
| Path                 | Komponen         | Deskripsi                                               |
| -------------------- | ---------------- | ------------------------------------------------------- |
| `/`                  | `Home`           | Halaman utama yang menampilkan daftar anime dan review. |
| `/login`             | `Login`          | Halaman login pengguna.                                 |
| `/register`          | `Register`       | Halaman registrasi pengguna baru.                       |
| `/dashboard`         | `Dashboard`      | Halaman dashboard untuk pengguna biasa.                 |
| `/detail/:id`        | `Detail`         | Halaman detail informasi anime dan review.              |
| `/tambah-anime`      | `TambahAnime`    | Halaman admin untuk menambahkan anime baru.             |
| `/edit-anime/:id`    | `EditAnime`      | Halaman admin untuk mengedit anime.                     |
| `/tambah-review/:id` | `TambahReview`   | Halaman untuk menambah review anime tertentu.           |
| `/edit-review/:id`   | `EditReview`     | Halaman untuk mengedit review milik sendiri.            |
| `/admin-dashboard`   | `AdminDashboard` | Halaman khusus admin untuk melihat dan mengelola data.  |


## AuthProvider
Fitur otentikasi menggunakan React Context dan Cookies:

| Fungsi                      | Deskripsi                                                       |
| --------------------------- | --------------------------------------------------------------- |
| `login(username, password)` | Melakukan login dan menyimpan access token serta refresh token. |
| `logout()`                  | Menghapus token dan mengakhiri sesi pengguna.                   |
| `refreshAccessToken()`      | Memperbarui access token menggunakan refresh token.             |


## useAuth Hook
Hook khusus yang menyediakan fungsi-fungsi berikut:

| Properti / Fungsi      | Deskripsi                                              |
| ---------------------- | ------------------------------------------------------ |
| `accessToken`          | Token akses pengguna yang sedang aktif.                |
| `login()`              | Fungsi untuk login pengguna.                           |
| `logout()`             | Fungsi untuk logout pengguna.                          |
| `refreshAccessToken()` | Fungsi untuk memperbarui access token dari backend.    |
| `isAuthenticated`      | Boolean untuk menandakan apakah pengguna sedang login. |


