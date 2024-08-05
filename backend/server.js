import express from 'express';
import crypto from 'crypto';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// const crypto = require('crypto'); // Add this at the top of your file

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'amit1aadya',
  database: 'securevote'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected');
});

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  }
});

const upload = multer({ storage });

// Middleware to verify JWT token for general users
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'amitroyauth', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Middleware to verify JWT token specifically for admins
const verifyAdminToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'amitroyauth', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    req.adminId = decoded.id;
    next();
  });
};

// User registration
app.post('/api/register', async (req, res) => {
  const { name, voterNumber, phoneNumber, email, dateOfBirth, gender, address, password } = req.body;

  if (!name || !voterNumber || !phoneNumber || !email || !dateOfBirth || !gender || !address || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the user already exists
  db.query('SELECT * FROM users WHERE voter_number = ? OR email = ?', [voterNumber, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      // User exists
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password and insert new user
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Password hashing error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      db.query('INSERT INTO users (name, voter_number, phone_number, email, date_of_birth, gender, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [name, voterNumber, phoneNumber, email, dateOfBirth, gender, address, hashedPassword], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});


// User login
app.post('/api/login', async (req, res) => {
  const { voterNumber, password } = req.body;

  // Validate inputs
  if (!voterNumber || !password) {
    return res.status(400).json({ message: 'Voter Number and Password are required' });
  }

  db.query('SELECT * FROM users WHERE voter_number = ?', [voterNumber], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials: Wrong password' });
    }

    // Create JWT token with userId and role (optional, depending on your app's need)
    const token = jwt.sign({ userId: user.id, role: 'user' }, 'amitroyauth', { expiresIn: '1h' });

    // Set token in HttpOnly cookie
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }); // Ensure cookies are secure

    // Send success response
    res.status(200).json({ message: 'Login successful' });
  });
});



// Admin registration
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if username already exists
    const [existingAdmin] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Error registering admin', error });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [admins] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, 'amitroyauth', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Admin logged in successfully' });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Error logging in admin', error });
  }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Admin logged out successfully' });
});

// Check authentication
app.get('/api/checkAuth', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'amitroyauth', (err) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    res.status(200).json({ message: 'Authenticated' });
  });
});

// Protected route example
app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route!' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// Admin adds a voter
app.post('/api/admin/addVoter', verifyAdminToken, async (req, res) => {
  const { voterNumber, phoneNumber } = req.body;

  if (!voterNumber || !phoneNumber) {
    return res.status(400).json({ message: 'Voter number and phone number are required' });
  }

  try {
    // Check if voter number and phone number exist in the users table
    const [userResults] = await db.promise().query('SELECT * FROM users WHERE voter_number = ? AND phone_number = ?', [voterNumber, phoneNumber]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'No matching voter found with the provided number and phone number' });
    }

    const user = userResults[0];

    // Check if voter number already exists in the voters table
    const [voterResults] = await db.promise().query('SELECT * FROM voters WHERE voter_number = ?', [voterNumber]);

    if (voterResults.length > 0) {
      return res.status(400).json({ message: 'Voter number already added' });
    }

    // Insert the user details into the voters table
    await db.promise().query('INSERT INTO voters (voter_number, name, phone_number, email, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [user.voter_number, user.name, user.phone_number, user.email, user.date_of_birth, user.gender, user.address]);

    res.status(201).json({ message: 'Voter added successfully' });
  } catch (error) {
    console.error('Error adding voter:', error);
    res.status(500).json({ message: 'Error adding voter', error });
  }
});


// Route to get voter details by voter number
app.get('/api/admin/voter/:voterNumber', async (req, res) => {
  const { voterNumber } = req.params;
  
  try {
    const [rows] = await db.promise().query('SELECT * FROM voters WHERE voter_number = ?', [voterNumber]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    res.json({ voter: rows[0] });
  } catch (error) {
    console.error('Error fetching voter details:', error);
    res.status(500).json({ message: 'Error fetching voter details', error });
  }
});

// Route to update voter details by voter number
app.put('/api/admin/voter/:voterNumber', async (req, res) => {
  const { voterNumber } = req.params;
  const { name, phone_number, email, date_of_birth, gender, address } = req.body;

  try {
    // Check if voter number exists
    const [voterResults] = await db.promise().query('SELECT * FROM voters WHERE voter_number = ?', [voterNumber]);
    if (voterResults.length === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    // Construct the SET clause dynamically
    const fields = { name, phone_number, email, date_of_birth, gender, address };
    const filteredFields = {};
    for (const key in fields) {
      if (fields[key] !== null && fields[key] !== undefined) {
        filteredFields[key] = fields[key];
      }
    }

    if (Object.keys(filteredFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const setClause = Object.keys(filteredFields)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(filteredFields);

    await db.promise().query(`UPDATE voters SET ${setClause} WHERE voter_number = ?`, [...values, voterNumber]);

    res.json({ message: 'Voter details updated successfully' });
  } catch (error) {
    console.error('Error updating voter details:', error);
    res.status(500).json({ message: 'Error updating voter details', error });
  }
});

// Route to delete voter by voter number
app.delete('/api/admin/voter/:voterNumber', async (req, res) => {
  const { voterNumber } = req.params;

  try {
    // Check if voter number exists
    const [voterResults] = await db.promise().query('SELECT * FROM voters WHERE voter_number = ?', [voterNumber]);
    if (voterResults.length === 0) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    // Delete voter
    await db.promise().query('DELETE FROM voters WHERE voter_number = ?', [voterNumber]);

    res.json({ message: 'Voter deleted successfully' });
  } catch (error) {
    console.error('Error deleting voter:', error);
    res.status(500).json({ message: 'Error deleting voter', error });
  }
});
// Admin adds a candidate
app.post('/api/admin/addCandidate', verifyAdminToken, upload.single('picture'), (req, res) => {
  const { candidate_id, candidate_name, candidate_party, block_number } = req.body;
  const picture = req.file ? req.file.filename : null;

  if (!candidate_id || !candidate_name || !candidate_party || !block_number || !picture) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO candidates (candidate_id, candidate_name, candidate_party, block_number, picture) VALUES (?, ?, ?, ?, ?)';
  const values = [candidate_id, candidate_name, candidate_party, block_number, picture];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error storing candidate:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'Candidate added successfully' });
  });
});

// Serve uploaded pictures
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Route to get candidate details by ID
app.get('/api/admin/getCandidate/:id', verifyAdminToken, (req, res) => {
  const candidateId = req.params.id;
  const query = 'SELECT * FROM candidates WHERE candidate_id = ?';

  db.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error('Error fetching candidate:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Route to update candidate details
app.put('/api/admin/updateCandidate/:id', verifyAdminToken, upload.single('picture'), (req, res) => {
  const candidateId = req.params.id;
  const { candidate_name, candidate_party, block_number } = req.body;
  const picture = req.file ? req.file.filename : null;

  // Construct the query and values based on whether the picture is provided or not
  let query = 'UPDATE candidates SET candidate_name = ?, candidate_party = ?, block_number = ?';
  let values = [candidate_name, candidate_party, block_number];
  
  if (picture) {
    query += ', picture = ?';
    values.push(picture);
  }
  
  query += ' WHERE candidate_id = ?';
  values.push(candidateId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating candidate:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate updated successfully' });
  });
});

// Route to delete a candidate by ID
app.delete('/api/admin/deleteCandidate/:id', verifyAdminToken, (req, res) => {
  const candidateId = req.params.id;

  // Delete the candidate from the database
  const query = 'DELETE FROM candidates WHERE candidate_id = ?';

  db.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error('Error deleting candidate:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  });
});



// Route to fetch all candidates
app.get('/api/candidates', (req, res) => {
  const query = 'SELECT candidate_id, candidate_name, candidate_party, block_number, picture FROM candidates';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching candidates:', err);
      return res.status(500).json({ message: 'Error fetching candidates' });
    }
    res.json(results);
  });
});



// Route to verify voter number
app.post('/api/verify-voter', (req, res) => {
  const { voterNumber } = req.body;

  if (!voterNumber) {
    return res.status(400).json({ error: 'Voter number is required' });
  }

  const query = 'SELECT * FROM voters WHERE voter_number = ?';

  db.query(query, [voterNumber], (err, results) => {
    if (err) {
      console.error('Error verifying voter number:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      // Voter number found
      res.json({ verified: true });
    } else {
      // Voter number not found
      res.json({ verified: false });
    }
  });
});



// Vote route
app.post('/api/vote', (req, res) => {
  const { candidateId } = req.body;

  if (!candidateId) {
    return res.status(400).json({ error: 'Candidate ID is required' });
  }

  // Check if the candidate exists
  db.query('SELECT * FROM candidates WHERE id = ?', [candidateId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Insert vote into result table
    db.query('INSERT INTO result (candidate_id) VALUES (?)', [candidateId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error inserting vote' });
      }

      res.status(200).json({ message: 'Vote successfully cast' });
    });
  });
});
