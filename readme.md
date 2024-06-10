# Online Test organisation website workflow

On our website, we have organised an exam process that is managed by the admin. Initially, the admin completes Form A to set up the exam. In this form, the admin enters the test name, the date of the exam, and provides the questions along with their multiple-choice answers.

Once the exam is set up, we provide a link to the form, which the admin can then share with their students. Students use this link to access and complete the test.

[![Figure 1](https://app.eraser.io/workspace/8HcWJgK2SsXEyDqvZVfb/preview?elements=IY4zEM2u-eDEzad1h5HzXQ&type=embed)](https://app.eraser.io/workspace/8HcWJgK2SsXEyDqvZVfb?elements=IY4zEM2u-eDEzad1h5HzXQ)

### Database Design and Workflow Description
#### Admin Panel
The Admin Panel is the central hub for managing the exam process. The admin performs several key tasks here:

1. **Create Exam Form:** The admin uses the admin panel to fill out Form A, providing details such as the test name, date, questions, and multiple-choice answers.
2. **Share Form Link:** Once the exam form is created, the admin generates a unique link to the form and shares it with their clients (students).
#### Conduct Exam Form
1. **Form Link Generation:** After creating the exam in the Admin Panel, a unique link to the Conduct Exam Form is generated. This link is then shared with the students.
2. **Student Access:** Students receive the form link and use it to access the Conduct Exam Form.
3. **Filling Out the Form:** Students fill out the form by answering the provided questions.
4. **Data Storage:** Upon submission, the students' responses are stored in the database.
#### Database
The database acts as the storage center for all exam-related data. It includes several tables to organize and maintain the data efficiently:

1. **Exam Details Table:** Stores information about each exam, such as the test name, date, and the unique link to the form.
2. **Questions Table:** Contains all the questions and their corresponding multiple-choice answers for each exam.
3. **Student Responses Table:** Records the answers submitted by students.
### Workflow
1. **Admin Creates Exam:** The admin logs into the Admin Panel and fills out Form A to create a new exam.
2. **Link Sharing:** The admin shares the unique form link with students.
3. **Students Access Form:** Students receive the form link and fill out the Conduct Exam Form.
4. **Data Storage:** Students' responses are saved into the database, where they can be accessed and reviewed by the admin.
### Summary
This system allows for seamless creation, distribution, and management of exams. The admin panel facilitates the exam setup, while the database ensures all data is securely stored and easily retrievable. The workflow ensures a straightforward process for both the admin and the students, making the entire examination process efficient and user-friendly.

## Database Design
Let's take a look at the database design, where we create tables to store data. We'll display all the tables in the database and explain their workflow.

### Database table design
[![Figure 2](https://app.eraser.io/workspace/8HcWJgK2SsXEyDqvZVfb/preview?elements=x7SaXv6Xy0cA74GFpm3Mbg&type=embed)](https://app.eraser.io/workspace/8HcWJgK2SsXEyDqvZVfb?elements=x7SaXv6Xy0cA74GFpm3Mbg)

### Tables workflows 
[![Figure 3](https://app.eraser.io/workspace/8HcWJgK2SsXEyDqvZVfb/preview?elements=I0iVLOfaJTintQKUAQrEVw&type=embed)](https://app.eraser.io/workspace/8HcWJgK2SsXEyDqvZVfb?elements=I0iVLOfaJTintQKUAQrEVw)

### Detailed Description of the Database Diagram
The provided diagram outlines the structure and workflow of a test website's database. Here is a comprehensive breakdown:

#### Database Tables
1. **Admins Table**
    - **Fields:**
        - `name` : The name of the admin.
        - `email` : The email address of the admin.
        - `password` : The password for the admin account.
        - `id` : A unique identifier for each admin.
2. **Admin Table Id**
    - **Fields:**
        - `test_name` : The name of the test.
        - `test_id` : A unique identifier for each test.
        - `csv_file` : A file containing test questions and answers.
        - `timer` : The duration of the test.
        - `date` : The date on which the test is scheduled.
3. **Students Table**
    - **Fields:**
        - `name` : The name of the student.
        - `email` : The email address of the student.
        - `resume_drive_link` : A link to the student's resume stored on Google Drive.
4. **Test Table**
    - **Fields:**
        - `apply_students` : List of students who have applied for the test.
        - `results` : The results of the test.
        - `status` : The current status of the test (e.g., pending, completed).
### Workflow Description
1. **Admin Panel Operations:**
    - **Admin List:** Maintains a list of all admins who have joined the platform.
    - **Admin Actions:**
        - Admin logs into the Admin Panel and creates a new test by filling in details such as the test name, date, and uploading a CSV file with questions and answers.
        - Once the test is created, the admin generates a unique form link for the test.
2. **Test Distribution:**
    - The admin shares the test link with the students, either through email or another communication platform.
3. **Student Actions:**
    - Students receive the form link and fill out their details and answers in the Conduct Exam Form.
    - Students' responses are then stored in the database.
4. **Data Storage and Management:**
    - **Admins Table:** Stores admin credentials and details.
    - **Admin Table Id:** Stores test-specific details created by admins.
    - **Students Table:** Stores student details and their resume links.
    - **Test Table:** Tracks which students have applied for tests, their results, and the test status.
### Summary
This database design supports a streamlined process for administering online tests. Admins can efficiently create and manage tests, while students can easily apply and participate. The structured tables ensure organised storage of all necessary data, enabling smooth retrieval and management of information. The workflow ensures that both admin and student activities are tracked and managed effectively, providing a comprehensive system for online testing.

## Back-end Workflow
For our project, we utilize several key packages: `**dotenv**`, `**jsonwebtoken**`, `**express**`, `**mysql2**`, and `**nodemailer**`.

### Database Configuration
We are using a **Relational Database Management System (RDBMS)**. To manage our database, we start by creating a table named `**tests**` as an initial setup. Following this, we create an `**admin**` table along with a trigger to automatically generate a unique `**user_id**` for each new admin entry.

### Admin Table and Trigger Setup
### **1. **Create the Admin Table
CREATE TABLE tests and then we  create a table admin and trigger it 

```
-- Admin Table create with trigger
-- Create the table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(25) UNIQUE KEY,
    name VARCHAR(25) NOT NULL,
    password VARCHAR(64) NOT NULL,
    user_id VARCHAR(25)
);

-- Create the trigger
DELIMITER $$

CREATE TRIGGER before_insert_admin
BEFORE INSERT ON admin
FOR EACH ROW
BEGIN
    -- Generate the user_id with the prefix and padded id
    SET NEW.user_id = CONCAT('admin_', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES 
                                            WHERE TABLE_SCHEMA = DATABASE() 
                                            AND TABLE_NAME = 'admin'), 4, '0'));
END$$

DELIMITER ;
```
### Key Points
- **Packages Utilized**:
    - `**dotenv**` : For managing environment variables.
    - `**jsonwebtoken**` : For handling JSON Web Tokens.
    - `**express**` : A web application framework for Node.js.
    - `**mysql2**` : MySQL client for Node.js with support for prepared statements.
    - `**nodemailer**` : For sending emails.
- **Admin Table**:
    - Contains fields: `**id**` , `**email**` , `**name**` , `**password**` , `**user_id**` .
    - `**user_id**`  is auto-generated using a trigger, ensuring a unique identifier prefixed with "admin_".
This setup ensures a structured approach to managing admin users in our application, leveraging the strengths of our chosen packages and the capabilities of our **RDBMS.**

### 2. Create a Table for Each Admin's Tests
```sql
-- Replace {admin_id} with the actual admin ID
CREATE TABLE {admin_id}_tests (
    test_id VARCHAR(30) PRIMARY KEY NOT NULL,
    test_name VARCHAR(30) NOT NULL,
    questions JSON NOT NULL,
    timing INT NOT NULL,
    test_date DATE NOT NULL 
);
```
### 3. Create a Table for Each Test's Responses
```sql
-- Replace {test_id} with the actual test ID
CREATE TABLE {test_id}_responses (
    email VARCHAR(255) PRIMARY KEY NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'attend',
    response JSON,
    score INT NOT NULL
);
```
## API Endpoints
### Base URL
All API endpoints are prefixed with the base URL:

```plaintext
const main_url = "http://localhost:5500/admin";
```
### Authentication Endpoints
#### 1. Signup
Admins can sign up using the signup endpoint. The server will send a verification URL to the admin's email. When the admin clicks on the URL, the server will decrypt the token and verify the admin.

**Endpoint:**

```plaintext
POST ${main_url}/auth/signup
```
**Request Body:**

```json
{
  "name": "Admin Name",
  "email": "example@gmail.com",
  "password": "something"
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/signup
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "example@gmail.com",
  "password": "something"
}
```
The server sends a verification email to `example@gmail.com` with a token.

**Received Email:**

```plaintext
Please verify your email by clicking on the following link:
http://localhost:5500/admin/auth/verify?value={token}
```
When the admin clicks the link, the server will trigger the verification process, decrypt the token, and verify the admin's ID, completing the signup process.

#### 2. Login
Admins can login using the login endpoint. The server will send a token and some data like { admin_id, admin_email, token } to respond. Admin use token to it's header.

**Endpoint:**

```plaintext
POST ${main_url}/auth/login
```
**Request Body:**

```json
{
  "email": "example@gmail.com",
  "password": "something"
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/login
Content-Type: application/json

{
  "email": "example@gmail.com",
  "password": "something"
}
```
The server sends a verification link to email `example@gmail.com` with a token.

**Response**: 

```
{
  info:
    {
      name: admin.name, 
      email: admin.email
    }, 
  token: token 
}
```
When the admin get response they use token in their header to request further request.

#### 3.  Forget Password
Admins can forget password using the forget-password endpoint. The server will send a OTP to the admin's email. When the admin enter OTP, the server will verified the OTP and change password of the admin.

**Endpoint:**

```plaintext
POSt ${main_url}/auth/forget-password
```
**Request Body:**

```json
{
  "email": {email}
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/verify-otp
Content-Type: application/json

{
  "email": {email}
}
```
The server sends a OTP email to `example@gmail.com`.

**Received OTP:**

```plaintext
Change your password using this OTP:
{OTP}
```
When the admin verify the OTP, the server will do the verification process, change password of admin and, completing the forget password process.

**Endpoint:**

```plaintext
post ${main_url}/auth/update-password
```
**Request Body:**

```json
{
  "eamil" : {email},
  "otp": {otp},
  "password": {new-password}
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/verify-otp
Content-Type: application/json

{
  "email": "example.com",
  "otp": "234567",
  "password": "password"
}
```
## Working Endpoints
### 1. Past Test List
When an admin logs into their dashboard, it automatically calls the endpoint to retrieve the list of past tests that have been held.

**Endpoint:**

```plaintext
GET ${main_url}/past-test
```
**Headers:**

```plaintext
auth: ${token}
```
**Description:**
The server responds with a list of past tests, including their IDs, names, and dates.

**Response Example:**

```json
{
  "test_id": [1, 2, 3],
  "test_name": ["Math Test", "Science Quiz", "History Exam"],
  "test_date": ["2024-01-10", "2024-02-15", "2024-03-20"]
}
```
After receiving the response, the admin uses the token in the header for further requests.

### 2. All Test List
When an admin logs into their dashboard and want all test list, it calls the endpoint to retrieve the list of all tests that have been organised.

**Endpoint:**

```plaintext
GET ${main_url}/test-list
```
**Headers:**

```plaintext
Authorization: Bearer ${token}
```
**Description:**
The server responds with a list of past tests, including their IDs, names, and dates.

**Response Example:**

```json
{
  "test_id": [1, 2, 3],
  "test_name": ["Math Test", "Science Quiz", "History Exam"],
  "test_date": ["2024-01-10", "2024-02-15", "2024-03-20"]
}
```
After receiving the response, the admin uses the token in the header for further requests.

### 3. Organize Test
When an admin wants to create a new test, they trigger this endpoint to organize the test.

**Endpoint:**

```plaintext
POST ${main_url}/organized-test
```
**Headers:**

```plaintext
Authorization: Bearer ${token}
Content-Type: application/json
```
**Request Body:**

```json
{
  "test_name": "Sample Test Name",
  "test_date": "2024-06-01",
  "test_timing": "60", // in minutes
  "csv-file": question.csv // file
}
```
**Description:**

The server responds with a id for the admin to share with students, who will use it to fill out the form for the test.

**Response Example:**

```json
{
  "test_id": "test_00120240531"
}
```
After receiving the it in the response, the admin can share it with their students to fill out the form and take the test.

### 4. List of students who give test or apply test
When an admin wants to see how many and which student is join and apply for test the test.

**Endpoint:**

```plaintext
GET ${main_url}/students-list?test_id={test_id}
```
**Headers:**

```plaintext
Authorization: Bearer ${token}
```
**Description:**
The server responds with a list of past tests, including their IDs, names, and dates.

**Response Example:**

```json
{
  name: {...studentsname},
  email: {...studentEmail},
  status: {...studentStatus},
  score: {...studentScore}
  response: {...studentResponse},
}
```
After receiving the response, the admin uses the token in the header for further requests.

### Student Workflow Mechanism
1. **Admin Sends Signup Link:**
    - Admin sends or shares a signup link with the students for a specific test.
2. **Student Fills Signup Form:**
    - All students, whether verified or non-verified, fill out the signup form.
    - The form captures the student's name, email, and resume link.
3. **Server Processes Signup Request:**
    - The server receives the signup request and checks if the student is already in the student table.
4. **Verification Check:**
    - If the student is **already verified**:
        - The server directly registers the student for the test.
        - Updates the student’s data in the student table if necessary.
    - If the student is **not verified**:
        - The server generates a verification token.
        - Sends a verification email to the student with a verification URL.
5. **Student Verifies Email:**
    - The student clicks on the verification link in the email.
    - The server decrypts the token and verifies the student.
    - Upon verification, the student is registered for the test.
    - The student's data is added to the student table if they are new.
6. **Completion:**
    - The student is now registered for the test and their data is updated or added to the student table.
### Student Table
### **1. **Create the Student Table
```
-- Create the table for Students
CREATE TABLE students (
    name VARCHAR(255) NOT NULL,
    eamil VARCHAR(255) PRIMARY KEY NOT NULL,
    resume_link VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT FALSE
)
```
### API Endpoint and Flow
### Base URL
All API endpoints are prefixed with the base URL:

```plaintext
const main_url = "http://localhost:5500/student";
```
### Authentication Endpoints
#### 1. Signup
Students can sign up using the signup endpoint. The server will handle verification based on whether the student is already verified or not.

**Endpoint:**

```plaintext
POST ${main_url}/auth/signup?test_id={test_id}
```
**Request Body:**

```json
{
  "name": "Student's name",
  "email": "example@gmail.com",
  "resume_link": "link"
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/signup
Content-Type: application/json

{
  "name": "Student's name",
  "email": "example@gmail.com",
  "resume_link": "link"
}
```
### Server-Side Logic
1. **Receive Signup Request:**
    - Extract the student details and test ID from the request body.
    - Check if the student exists in the student table.
2. **Check Verification Status:**
    - If the student is verified:
        - Register the student for the test.
        - Update the student’s data if necessary.
    - If the student is not verified:
        - Generate a verification token.
        - Send a verification email with a URL containing the token.
3. **Verification Email:**
    - The email contains a link like `${main_url}/auth/verify?token={token}` .
4. **Verification Endpoint:**
**Endpoint:**

```plaintext
GET ${main_url}/auth/verify?token={token}
```
**Server Actions:**

- Decrypt the token.
- Verify the student's email.
- Register the student for the test.
- Add the student to the student table if new.
### Example Flow
1. **Student Signup:**
    - `POST http://localhost:5500/admin/auth/signup` 
    - Body: `{ "name": "Student's name", "email": "example@gmail.com", "resume_link": "link" }` 
2. **Server Checks Student:**
    - If `example@gmail.com`  is not in the student table, send a verification email.
3. **Student Clicks Verification Link:**
    - `GET http://localhost:5500/admin/auth/verify?token={token}` 
4. **Server Verifies Student:**
    - Decrypts the token, verifies the student, registers for the test, and updates the student table.
### Workflow Mechanism for Logic
1. **Workflow Mechanism for LoginStudent Login:**
    - Students login and receive an encrypted token that includes their email and test ID.
2. **Token Usage:**
    - This token is used in the headers for subsequent requests (`submit-response`  and `suspend` ).
### API Endpoint and Flow
#### 2. Login
Students can log in using the login endpoint. The server will handle verification and issue an encrypted token upon successful login.

**Endpoint:**

```plaintext
POST ${main_url}/auth/login
```
**Request Body:**

```json
{
  "email": "example@gmail.com",
  "test_id": "test_000120240603"
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/login
Content-Type: application/json

{
  "email": "example@gmail.com",
  "test_id": "test_000120240603"
}
```
**Success Response:**

```json
{
  "status": "success",
  "token": "encrypted_token"
}
```
**Error Response:**

```json
{
  "status": "error",
  "message": "Authentication failed."
}
```
### API for `submit-response`    
**Endpoint:**

```plaintext
POST ${main_url}/auth/submit-response
```
**Request Headers:**

```plaintext
Authorization: Bearer encrypted_token
```
**Request Body:**

```json
{
  "responses": [
    {
      "question_id": "q1",
      "selected_option": "Paris"
    },
    {
      "question_id": "q2",
      "selected_option": "The theory of relativity describes the laws of physics in the presence of gravity."
    }
  ]
}
```
**Example:**

```plaintext
POST http://localhost:5500/admin/auth/submit-response
Content-Type: application/json
Authorization: Bearer encrypted_token

{
  "responses": [
    {
      "question_id": "q1",
      "selected_option": "Paris"
    },
    {
      "question_id": "q2",
      "selected_option": "The theory of relativity describes the laws of physics in the presence of gravity."
    }
  ]
}
```
**Server-Side Logic for **`**submit-response**` 

1. **Receive Response Submission:**
    - Extract the token from the headers.
    - Decrypt the token to get the student's email and test ID.
2. **Validate Submission:**
    - Ensure the student is verified and registered for the test.
3. **Store Responses:**
    - Save the responses in the database, associating them with the student's record and the specific test.
4. **Send Response:**
    - Confirm successful submission with a status message.
**Success Response:**

```json
{
  "status": "success",
  "message": "Responses submitted successfully."
}
```
**Error Response (Not Registered):**

```json
{
  "status": "error",
  "message": "Student not registered for the test."
}
```
### API for `suspend`    
**Endpoint:**

```plaintext
GET ${main_url}/auth/suspend
```
**Request Headers:**

```plaintext
Authorization: Bearer encrypted_token
```
**Example:**

```plaintext
GET http://localhost:5500/admin/auth/suspend
Authorization: Bearer encrypted_token
```
**Server-Side Logic for **`**suspend**` 

1. **Receive Suspension Request:**
    - Extract the token from the headers.
    - Decrypt the token to get the student's email and test ID.
2. **Validate Request:**
    - Ensure the student is registered for the test.
3. **Update Status:**
    - Mark the student as suspended in the database.
4. **Send Response:**
    - Confirm the suspension with a status message.
**Success Response:**

```json
{
  "status": "success",
  "message": "Student suspended successfully."
}
```
**Error Response (Not Registered):**

```json
{
  "status": "error",
  "message": "Student not registered for the test."
}
```
### Summary of Updated Workflow
**Login API:**

- **Endpoint:** `POST ${main_url}/auth/login` 
- **Request Body:** Student's email and test ID.
- **Response:** Encrypted token.
**Submit-Response API:**

- **Endpoint:** `POST ${main_url}/auth/submit-response` 
- **Headers:** `Authorization: Bearer encrypted_token` 
- **Request Body:** Student's responses.
- **Server Actions:** Validate token, store responses, send confirmation.
**Suspend API:**

- **Endpoint:** `GET ${main_url}/auth/suspend` 
- **Headers:** `Authorization: Bearer encrypted_token` 
- **Server Actions:** Validate token, mark as suspended, send confirmation.
This approach ensures secure handling of student information and actions through encrypted tokens passed in the request headers.


