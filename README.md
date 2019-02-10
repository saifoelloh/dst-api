# Doscom Sharing Time - API

API ini dibuat menggunakan expressjs, ia hanya memiliki 2 collections atau bisa
disebut dengan tabel yaitu *author* dan *book*. Detail dari rute masing" adalah
seperti dibawah:

```
  AuthorModel: {
    _id: ObjectId,
    name: String,
    email: String,
    password: String,
    photo: String,
    age: String,
    books: [ObjectId of BookModel]
  }

  BookModel: {
    _id: ObjectId,
    title: String,
    desc: String,
    photo: String,
    release: Date,
    author: ObjectId of AuthorModel
  }
```

## Author
- `/api/author/list` => GET
    rute ini digunakan untuk menampilkan pengarang yang terdata didalam sistem.
- `/api/author` => GET => rute diamankan dengan *JWT*
    mengambil detail dari author melalui _token jwt_ yang mana ia menampung
    email dan id author
- `/api/author` => POST
    membuat author baru
- `/api/author/:id` => GET
    mengambil detail dari author berdasarkan *id*
- `/api/author/:id` => PUT => rute diamankan dengan *JWT*
    menmperbarui data dari author
- `/api/author/:id` => DELETE => rute diamankan dengan *JWT*
    menghapus author yang terdaftar didalam sistem

## Book
- `/api/book/` => GET
    mengambil seluruh buku beserta sedikit detail dari pengarang
- `/api/book/` => POST => rute diamankan dengan *JWT*
    membuat buku baru berdasarkan author
- `/api/book/:id` => GET
    mengambil detail dari buku beserta detail dari pengarang
- `/api/book/:id` => PUT => rute diamankan dengan *JWT*
    mengubah detail buku berdasarkan akun pengarang
- `/api/book/:id` => GET => rute diamankan dengan *JWT*
    menghapus buku berdasarkan akun pengarang

## Auth
- `/api/auth/login` => POST
    sistem login meggunakan *JWT*
