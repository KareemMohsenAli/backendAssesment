# Employee Management System

A professional Node.js application built with TypeScript, Express, MySQL, and Sequelize ORM. This system provides comprehensive employee and department management with advanced features like pagination, export functionality, and robust error handling.

## 🚀 Features

### Core Features
- **Employee Management**: Full CRUD operations for employees
- **Department Management**: Full CRUD operations for departments
- **Employee-Department Relationships**: Proper foreign key relationships
- **Pagination**: Efficient pagination with customizable page sizes
- **Search & Filtering**: Search employees by name/email and filter by department
- **Export Functionality**: Export employee data to CSV and PDF formats
- **Statistics**: Employee statistics and department-wise counts

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Professional Architecture**: Modular structure with separation of concerns
- **Global Error Handling**: Centralized error handling with proper logging
- **Validation**: Comprehensive input validation using Zod
- **Logging**: Structured logging with Winston
- **Security**: Helmet for security headers, rate limiting, CORS
- **Database Migrations**: Proper database schema management
- **Database Seeders**: Sample data for testing

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   ├── config.ts          # Application configuration
│   ├── database.ts        # Database connection
│   ├── associations.ts    # Model associations
│   └── sequelize.config.js # Sequelize CLI config
├── modules/               # Feature modules
│   ├── department/        # Department module
│   │   ├── models/        # Department model
│   │   ├── controllers/   # Department controllers
│   │   ├── services/      # Department business logic
│   │   └── routes/        # Department routes
│   └── employee/          # Employee module
│       ├── models/        # Employee model
│       ├── controllers/   # Employee controllers
│       ├── services/      # Employee business logic
│       └── routes/        # Employee routes
├── shared/                # Shared utilities
│   ├── error/            # Error handling
│   ├── validation/       # Validation schemas
│   └── logger/           # Logging configuration
├── utils/                # Utility functions
│   ├── pagination/       # Pagination utilities
│   ├── export/           # Export functionality
│   └── response/         # API response helpers
├── middleware/           # Express middleware
├── routes/              # Main route definitions
├── database/            # Database files
│   ├── migrations/      # Database migrations
│   └── seeders/         # Database seeders
└── server.ts            # Application entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=employee_management
   DB_USERNAME=root
   DB_PASSWORD=your_password
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   npm run migrate
   
   # Seed the database
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /health
```

### Department Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/departments` | Create a new department |
| GET | `/api/departments` | Get all departments (paginated) |
| GET | `/api/departments/:id` | Get department by ID |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |
| GET | `/api/departments/:id/employees` | Get department with employees |

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Create a new employee |
| GET | `/api/employees` | Get all employees (paginated) |
| GET | `/api/employees/:id` | Get employee by ID |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/department/:departmentId` | Get employees by department |
| GET | `/api/employees/statistics` | Get employee statistics |
| GET | `/api/employees/export?format=csv&departmentId=1` | Export employees |

### Query Parameters

#### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Filtering
- `search`: Search term for name/email
- `departmentId`: Filter by department ID

#### Export
- `format`: Export format (`csv` or `pdf`)
- `departmentId`: Filter by department before export

### Request/Response Examples

#### Create Employee
```json
POST /api/employees
{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "departmentId": 1,
  "salary": 75000.00
}
```

#### Response
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@company.com",
    "departmentId": 1,
    "salary": "75000.00",
    "Department": {
      "id": 1,
      "name": "Engineering"
    },
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Code Quality

The project follows professional coding standards:
- TypeScript for type safety
- ESLint for code linting
- Modular architecture with separation of concerns
- Comprehensive error handling
- Structured logging
- Input validation
- Security best practices

## 🗄️ Database Schema

### Departments Table
- `id` (Primary Key)
- `name` (Unique)
- `created_at`
- `updated_at`

### Employees Table
- `id` (Primary Key)
- `name`
- `email` (Unique)
- `department_id` (Foreign Key)
- `salary`
- `created_at`
- `updated_at`

## 📊 Export Features

### CSV Export
- Includes all employee data with department names
- Properly formatted with headers
- Supports filtering by department

### PDF Export
- Professional PDF report format
- Includes employee statistics
- Table format with proper alignment

## 🔒 Security Features

- Helmet for security headers
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization
- SQL injection protection via Sequelize ORM
- Error handling without information leakage

## 📝 Logging

The application uses Winston for structured logging:
- Request/response logging
- Error logging with stack traces
- Database operation logging
- Export operation logging
- Logs are written to both console and files

## 🧪 Testing

The project structure supports easy testing:
- Modular architecture allows unit testing
- Service layer can be tested independently
- Database operations can be mocked
- API endpoints can be tested with integration tests

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper logging
4. Configure rate limiting
5. Set up monitoring
6. Run database migrations
7. Build the application
8. Start with PM2 or similar process manager

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

