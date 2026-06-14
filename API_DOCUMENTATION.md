# 📋 LOKA STAY — API DOCUMENTATION (Complete)

**Base URL Dev**: `http://localhost:3000/api`  
**Base URL Prod**: `https://YOUR-RAILWAY-URL.railway.app/api`  
**Auth**: JWT Bearer Token  

---

## 🔓 PUBLIC ENDPOINTS (Tanpa Token)

### GET /api/onboarding
```json
Response:
[
  { "id": 1, "title": "...", "description": "...", "imageUrl": "...", "stepOrder": 1 },
  { "id": 2, ... },
  { "id": 3, ... }
]
```

### POST /api/auth/register
```json
Request: { "name": "str", "email": "email", "phoneNumber": "str", "password": "min6" }
Response 201: { "message": "User registered successfully", "user": { "id":1, "name":"...", "email":"...", "phoneNumber":"..." } }
Error 400: { "message": "Email already registered" }
```

### POST /api/auth/login
```json
Request: { "email": "email", "password": "str" }
Response 200: { "access_token": "eyJ...", "user": { "id":1, "name":"...", "email":"...", "phoneNumber":"...", "avatarUrl":null } }
Error 401: { "message": "Invalid credentials" }
```

### GET /api/villas
```json
Response: [{ "id":1, "name":"...", "location":"...", "price":1500000, "rating":4.9, "image_url":"..." }]
```

### GET /api/villas/search
**Query params**: `location`, `check_in` (YYYY-MM-DD), `check_out`, `guest_count`, `min_price`, `max_price`
```
/api/villas/search?location=Bali&min_price=500000&max_price=2000000&check_in=2026-07-01&check_out=2026-07-05
```
```json
Response: { "total": 2, "results": [{ "id":1, "name":"...", "location":"...", "price":1500000, "rating":4.9, "capacity":6, "image_url":"..." }] }
```

### GET /api/villas/:id
```json
Response: {
  "id":1, "name":"...", "location":"...", "description":"...",
  "price":1500000, "capacity":6, "rating":4.9,
  "images": ["url1", "url2", "url3"],
  "facilities": [{ "id":1, "name":"WiFi", "icon":"wifi" }],
  "reviews": [{ "id":1, "rating":5, "comment":"...", "created_at":"...", "user":{ "id":1, "name":"...", "avatarUrl":null } }],
  "total_reviews": 3
}
```

---

## 🔐 PROTECTED ENDPOINTS (Butuh JWT)

Header: `Authorization: Bearer <access_token>`

### GET /api/user/profile
```json
Response: { "id":1, "name":"...", "email":"...", "phone_number":"...", "avatar_url":null, "created_at":"..." }
```

### PUT /api/user/profile
```json
Request: { "name": "str (optional)", "phone_number": "str (optional)", "avatar_url": "url (optional)" }
Response: { "message": "Profil berhasil diupdate", "user": { ... } }
```

### POST /api/user/logout
```json
Response: { "message": "Logout berhasil. Silakan hapus token di sisi aplikasi." }
```

### GET /api/favorites
```json
Response: [{ "id":1, "villa_id":1, "villa_name":"...", "villa_location":"...", "villa_price":1500000, "villa_rating":4.9, "image_url":"..." }]
```

### POST /api/favorites
```json
Request: { "villa_id": 1 }
Response 201: { "message": "Berhasil ditambahkan ke favorit", "data": { "id":1, "villa_id":1, ... } }
Error 409: { "message": "Villa sudah ada di favorit" }
```

### DELETE /api/favorites/:id
```json
Response: { "message": "Berhasil dihapus dari favorit" }
```

### POST /api/bookings
```json
Request: { "villa_id":1, "check_in":"2026-07-01", "check_out":"2026-07-05", "guest_count":4 }
Response 201: {
  "message": "Booking berhasil dibuat",
  "data": {
    "id":1, "villa_id":1, "villa_name":"...", "villa_location":"...", "image_url":"...",
    "check_in":"...", "check_out":"...", "guest_count":4,
    "nights":4, "price_per_night":1500000, "total_price":6000000,
    "status":"PENDING", "created_at":"..."
  }
}
Error 409: { "message": "Villa tidak tersedia untuk tanggal yang dipilih" }
Error 400: { "message": "Villa hanya muat X tamu" }
```

### GET /api/bookings/history
```json
Response: [{ "id":1, "villa_name":"...", "check_in":"...", "check_out":"...", "nights":4, "total_price":6000000, "status":"PENDING" }]
```

### POST /api/reviews
```json
Request: { "villa_id":1, "rating":5, "comment":"Villa luar biasa!" }
Response 201: { "message": "Review berhasil dikirim", "data": { "id":1, "rating":5, "comment":"...", "created_at":"...", "user":{...}, "villa":{...} } }
Error 400: { "message": "Kamu hanya bisa memberikan review untuk villa yang sudah pernah kamu booking" }
```

### GET /api/reviews/my
```json
Response: [{ "id":1, "rating":5, "comment":"...", "villa_name":"...", "image_url":"...", "created_at":"..." }]
```

---

## 🚀 SETUP COMMANDS

```bash
# 1. Install dependencies
npm install

# 2. Setup .env (copy dari .env.example, isi DATABASE_URL & JWT_SECRET)
cp .env.example .env

# 3. Generate Prisma client
npx prisma generate

# 4. Jalankan migrasi DB
npx prisma migrate deploy

# 5. Seed data (villa, onboarding, demo user)
npm run seed

# 6. Jalankan server
npm run start:dev
```

## 🧪 DEMO ACCOUNT
- Email: `demo@lokastay.com`
- Password: `demo123456`

---

## 📱 RETROFIT KOTLIN SETUP

```kotlin
// Interface
interface LokaStayApi {
    @POST("auth/login")
    suspend fun login(@Body req: LoginRequest): Response<LoginResponse>

    @GET("villas")
    suspend fun getVillas(): Response<List<Villa>>

    @GET("villas/search")
    suspend fun searchVillas(
        @Query("location") location: String? = null,
        @Query("min_price") minPrice: Long? = null,
        @Query("max_price") maxPrice: Long? = null,
        @Query("guest_count") guestCount: Int? = null,
        @Query("check_in") checkIn: String? = null,
        @Query("check_out") checkOut: String? = null
    ): Response<SearchResult>

    @GET("villas/{id}")
    suspend fun getVillaDetail(@Path("id") id: Int): Response<VillaDetail>

    @GET("favorites")
    suspend fun getFavorites(@Header("Authorization") token: String): Response<List<Favorite>>

    @POST("favorites")
    suspend fun addFavorite(@Header("Authorization") token: String, @Body req: FavoriteRequest): Response<Any>

    @DELETE("favorites/{id}")
    suspend fun removeFavorite(@Header("Authorization") token: String, @Path("id") id: Int): Response<Any>

    @POST("bookings")
    suspend fun createBooking(@Header("Authorization") token: String, @Body req: BookingRequest): Response<BookingResponse>

    @GET("bookings/history")
    suspend fun getBookingHistory(@Header("Authorization") token: String): Response<List<Booking>>

    @POST("reviews")
    suspend fun createReview(@Header("Authorization") token: String, @Body req: ReviewRequest): Response<Any>

    @GET("user/profile")
    suspend fun getProfile(@Header("Authorization") token: String): Response<Profile>

    @PUT("user/profile")
    suspend fun updateProfile(@Header("Authorization") token: String, @Body req: UpdateProfileRequest): Response<Any>
}

// Retrofit instance
object ApiClient {
    private const val BASE_URL = "https://YOUR-URL.railway.app/api/"
    // Dev/emulator: "http://10.0.2.2:3000/api/"

    val api: LokaStayApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(LokaStayApi::class.java)
    }
}

// Pakai token JWT:
val token = "Bearer ${prefs.getString("access_token", "")}"
val favorites = ApiClient.api.getFavorites(token)
```
