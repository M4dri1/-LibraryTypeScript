import express, { Request, Response } from 'express';
import path from 'path';
import mysql, { ResultSetHeader } from 'mysql2/promise';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const dbConfig = {
    host: 'db',
    user: 'root',
    password: '12345678',
    database: 'library1',
};

interface Book {
    book_id: number;
    title: string;
    author_id: number;
}

async function executeQuery<T = any>(query: string, params?: any[]): Promise<T> {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(query, params);
    await connection.end();
    return result as T;
}

app.get('/books', async (_req: Request, res: Response) => {
    try {
        const books = await executeQuery<Book[]>('SELECT * FROM books');
        res.json(books);
    } catch (err) {
        res.status(500);
    }
});

app.post('/books', async (req: Request, res: Response) => {
    const { author_id, title } = req.body;

    if (!author_id || !title) {
        return res.status(400);
    }

    try {
        await executeQuery<ResultSetHeader>(
            'INSERT INTO books (author_id, title) VALUES (?, ?)',
            [author_id, title]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500);
    }
});

app.delete('/books/:id', async (req: Request, res: Response) => {
    const book_id = parseInt(req.params.id);

    if (isNaN(book_id)) {
        return res.status(400);
    }

    try {
        await executeQuery<ResultSetHeader>(
            'DELETE FROM books WHERE book_id = ?',
            [book_id]
        );
        res.sendStatus(200);
    } catch (err) {
        res.status(500);
    }
});

app.put('/books/:id', async (req: Request, res: Response) => {
    const book_id = parseInt(req.params.id);
    const { title } = req.body;

    if (isNaN(book_id)) {
        return res.status(400);
    }

    if (!title) {
        return res.status(400);
    }

    try {
        await executeQuery<ResultSetHeader>(
            'UPDATE books SET title = ? WHERE book_id = ?',
            [title, book_id]
        );
        res.sendStatus(200);
    } catch (err) {
        res.status(500);
    }
});

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(3000, () => {
    console.log('Server http://localhost:3000');
});