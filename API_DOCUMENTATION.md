# Employee Management System API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, no authentication is required. All endpoints are publicly accessible.

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "pagination": {
    "currentPage": number,
    "totalPages": number,
    "totalItems": number,
    "itemsPerPage": number,
    "hasNextPage": boolean,
    "hasPreviousPage": boolean
  }
}
```

## Error Format
```json
{
  "success": false,
  "message": string,
  "errors": [
    {
      "field": string,
      "message": string
    }
  ]
}
```

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check if the API is running
- **Response**: 200 OK with system status

### Departments

#### Create Department
- **POST** `/api/departments`
- **Body**:
  ```json
  {
    "name": "Department Name"
  }
  ```
- **Response**: 201 Created with department data

#### Get All Departments
- **GET** `/api/departments`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `search` (optional): Search term for department name
- **Response**: 200 OK with paginated departments list

#### Get Department by ID
- **GET** `/api/departments/:id`
- **Response**: 200 OK with department data or 404 Not Found

#### Update Department
- **PUT** `/api/departments/:id`
- **Body**:
  ```json
  {
    "name": "Updated Department Name"
  }
  ```
- **Response**: 200 OK with updated department data

#### Delete Department
- **DELETE** `/api/departments/:id`
- **Response**: 200 OK with success message

#### Get Department with Employees
- **GET** `/api/departments/:id/employees`
- **Response**: 200 OK with department and its employees

### Employees

#### Create Employee
- **POST** `/api/employees`
- **Body**:
  ```json
  {
    "name": "Employee Name",
    "email": "employee@company.com",
    "departmentId": 1,
    "salary": 75000.00
  }
  ```
- **Response**: 201 Created with employee data

#### Get All Employees
- **GET** `/api/employees`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `departmentId` (optional): Filter by department ID
  - `search` (optional): Search term for name or email
- **Response**: 200 OK with paginated employees list

#### Get Employee by ID
- **GET** `/api/employees/:id`
- **Response**: 200 OK with employee data or 404 Not Found

#### Update Employee
- **PUT** `/api/employees/:id`
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@company.com",
    "departmentId": 2,
    "salary": 80000.00
  }
  ```
- **Response**: 200 OK with updated employee data

#### Delete Employee
- **DELETE** `/api/employees/:id`
- **Response**: 200 OK with success message

#### Get Employees by Department
- **GET** `/api/employees/department/:departmentId`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `search` (optional): Search term for name or email
- **Response**: 200 OK with paginated employees list for the department

#### Get Employee Statistics
- **GET** `/api/employees/statistics`
- **Response**: 200 OK with statistics data
  ```json
  {
    "success": true,
    "data": {
      "totalEmployees": 10,
      "averageSalary": 65000.00,
      "departmentCounts": [
        {
          "departmentName": "Engineering",
          "count": 5
        }
      ]
    }
  }
  ```

#### Export Employees
- **GET** `/api/employees/export`
- **Query Parameters**:
  - `format` (required): Export format (`csv` or `pdf`)
  - `departmentId` (optional): Filter by department before export
- **Response**: File download (CSV or PDF)

## Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

## Validation Rules

### Department
- `name`: Required, 2-100 characters, unique

### Employee
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `departmentId`: Required, positive integer, must reference existing department
- `salary`: Required, positive number

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses

## CORS
- Configured for development and production domains
- Credentials supported

## Logging
- All requests and responses are logged
- Error details logged for debugging
- Log files stored in `logs/` directory

## Example Usage

### Using curl

#### Create a department
```bash
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name": "Engineering"}'
```

#### Create an employee
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@company.com",
    "departmentId": 1,
    "salary": 75000
  }'
```

#### Get employees with pagination
```bash
curl "http://localhost:3000/api/employees?page=1&limit=10&search=john"
```

#### Export employees as CSV
```bash
curl -O "http://localhost:3000/api/employees/export?format=csv"
```

### Using JavaScript/TypeScript

```typescript
// Create employee
const response = await fetch('http://localhost:3000/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    departmentId: 1,
    salary: 80000
  })
});

const data = await response.json();
console.log(data);
```

## Testing
Run the test suite:
```bash
npm test
```

## Development
Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000` with hot reload enabled.

