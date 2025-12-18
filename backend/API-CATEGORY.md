# Category API Documentation

## Endpoints

### 1. Get All Categories

```http
GET /api/categories
```

**Query Parameters:**

- `includeInactive` (boolean, optional): Include inactive categories. Default: false

**Response:**

```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Điện thoại",
      "slug": "phone",
      "description": "Smartphone và điện thoại di động",
      "icon": "📱",
      "parentId": null,
      "displayOrder": 1,
      "isActive": true,
      "productCount": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Category Tree

```http
GET /api/categories/tree
```

**Query Parameters:**

- `includeInactive` (boolean, optional): Include inactive categories. Default: false

**Response:**

```json
{
  "tree": [
    {
      "id": "uuid",
      "name": "Điện thoại",
      "slug": "phone",
      "description": "Smartphone và điện thoại di động",
      "icon": "📱",
      "parentId": null,
      "displayOrder": 1,
      "isActive": true,
      "productCount": 2,
      "children": [
        {
          "id": "uuid",
          "name": "iPhone",
          "slug": "iphone",
          "parentId": "parent-uuid",
          "children": []
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Category by ID

```http
GET /api/categories/:id
```

**Path Parameters:**

- `id` (string, required): Category UUID

**Response:**

```json
{
  "category": {
    "id": "uuid",
    "name": "Điện thoại",
    "slug": "phone",
    "description": "Smartphone và điện thoại di động",
    "icon": "📱",
    "parentId": null,
    "displayOrder": 1,
    "isActive": true,
    "productCount": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Get Category by Slug

```http
GET /api/categories/slug/:slug
```

**Path Parameters:**

- `slug` (string, required): Category slug

**Response:**

```json
{
  "category": {
    "id": "uuid",
    "name": "Điện thoại",
    "slug": "phone",
    "description": "Smartphone và điện thoại di động",
    "icon": "📱",
    "parentId": null,
    "displayOrder": 1,
    "isActive": true,
    "productCount": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Create Category (Admin Only)

```http
POST /api/categories
Authorization: Bearer <admin-access-token>
```

**Request Body:**

```json
{
  "name": "iPhone",
  "slug": "iphone",
  "description": "Điện thoại iPhone của Apple",
  "icon": "📱",
  "parentId": "parent-category-uuid", // optional
  "displayOrder": 1,
  "isActive": true
}
```

**Response:**

```json
{
  "message": "Category created successfully",
  "category": {
    "id": "uuid",
    "name": "iPhone",
    "slug": "iphone",
    "description": "Điện thoại iPhone của Apple",
    "icon": "📱",
    "parentId": "parent-uuid",
    "displayOrder": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Update Category (Admin Only)

```http
PUT /api/categories/:id
Authorization: Bearer <admin-access-token>
```

**Path Parameters:**

- `id` (string, required): Category UUID

**Request Body:**

```json
{
  "name": "iPhone mới",
  "description": "Cập nhật mô tả",
  "displayOrder": 2,
  "isActive": false
}
```

**Response:**

```json
{
  "message": "Category updated successfully",
  "category": {
    "id": "uuid",
    "name": "iPhone mới",
    "slug": "iphone",
    "description": "Cập nhật mô tả",
    "icon": "📱",
    "parentId": "parent-uuid",
    "displayOrder": 2,
    "isActive": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Delete Category (Admin Only)

```http
DELETE /api/categories/:id
Authorization: Bearer <admin-access-token>
```

**Path Parameters:**

- `id` (string, required): Category UUID

**Response:**

```json
{
  "message": "Category deleted successfully"
}
```

## Error Responses

### Category Not Found (404)

```json
{
  "message": "Category not found"
}
```

### Validation Error (400)

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### Parent Category Not Found (400)

```json
{
  "message": "Parent category not found"
}
```

### Category Has Products (400)

```json
{
  "message": "Cannot delete category that has products"
}
```

### Unauthorized (401)

```json
{
  "message": "Access token is missing or invalid"
}
```

### Forbidden (403)

```json
{
  "message": "Access denied. Admin role required."
}
```

## Notes

- All category endpoints support hierarchical relationships via `parentId`
- Categories can have unlimited nesting levels (parent → child → grandchild...)
- Deleting a parent category will also delete all child categories (cascade)
- `productCount` field shows the number of products in that category
- Categories can be marked as active/inactive via `isActive` field
- Slug must be unique and URL-friendly
- Only admin users can create, update, or delete categories
