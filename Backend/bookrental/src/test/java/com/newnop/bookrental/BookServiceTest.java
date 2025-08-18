package com.newnop.bookrental;

import com.newnop.bookrental.model.Book;
import com.newnop.bookrental.repository.BookRepository;
import com.newnop.bookrental.repository.RentalRepository;
import com.newnop.bookrental.service.BookService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private RentalRepository rentalRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testBook = new Book();
        testBook.setId(1L);
        testBook.setIsbn("1234567890123");
        testBook.setTitle("Test Book");
        testBook.setAuthor("Test Author");
    }

    @Test
    void createBookTest() {
        when(bookRepository.findByIsbn(testBook.getIsbn())).thenReturn(null);
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        Book created = bookService.createBook(testBook);

        assertNotNull(created);
        assertTrue(created.isAvailable());
        verify(bookRepository, times(1)).save(testBook);
    }

    @Test
    void createAlreadyExistsBookTest() {
        when(bookRepository.findByIsbn(testBook.getIsbn())).thenReturn(testBook);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> bookService.createBook(testBook));

        assertEquals("Book with this ISBN already exists", ex.getMessage());
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    void getAllBooksTest() {
        when(bookRepository.findAll()).thenReturn(List.of(testBook));

        List<Book> books = bookService.getAllBooks();

        assertNotNull(books);
        assertEquals(1, books.size());
        assertEquals("Test Book", books.get(0).getTitle());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void updateBookTest() {
        when(bookRepository.findById(testBook.getId())).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        Book updated = bookService.updateBook(testBook);

        assertNotNull(updated);
        assertTrue(updated.isAvailable());
        verify(bookRepository, times(1)).save(testBook);
    }

    @Test
    void updateBookTestMissingId() {
        testBook.setId(null);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> bookService.updateBook(testBook));

        assertEquals("Book ID missing", ex.getMessage());
    }


    @Test
    void deleteBookTest() {
        when(bookRepository.findById(testBook.getId())).thenReturn(Optional.of(testBook));

        bookService.deleteBook(testBook.getId());

        verify(rentalRepository, times(1)).deleteAllByBookId(testBook.getId());
        verify(bookRepository, times(1)).delete(testBook);
    }

    @Test
    void deleteBookTestMissingId() {
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> bookService.deleteBook(null));

        assertEquals("Book ID missing", ex.getMessage());
        verify(bookRepository, never()).delete(any(Book.class));
    }

}
