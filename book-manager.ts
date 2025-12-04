import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SinglyLinkedList } from '../models/linked-list';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Book{
  title:string;
  author:string;
  year:number;
}

@Component({
  selector: 'app-book-manager',
  standalone:true,
  imports: [FormsModule, CommonModule],
  templateUrl: './book-manager.html',
  styleUrl: './book-manager.css'
})
export class BookManager implements OnInit {
  title = '';
  author = '';
  year:number | null = null;
  search = '';
  books:Book[] = [];
  filteredBooks: Book[] = [];
  message = '';

  private bookList = new SinglyLinkedList();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Book[]>('assets/books.json').subscribe(data => {
      this.books = data;
      this.filteredBooks = [...data];
      data.forEach(book => this.bookList.add(book));
      
    });
  }

  

  addBook():void{
    if(this.title && this.author && this.year !== null){
      const book: Book = { title: this.title.trim(), author: this.author.trim(), year: this.year };
      this.bookList.add(book);
      this.books = this.bookList.getAll();
      this.filteredBooks = [...this.books];
      this.clearForm();
    }
  }

  deleteBook(index: number): void {
    this.bookList.deleteAt(index);
    this.refreshBooks();
  }

  searchBooks(): void {
  const filter = this.search.trim().toLowerCase();

  if (!filter) {
    this.filteredBooks = [...this.books];
    this.message = '';
    return;
  }

  const result = this.books.filter(book =>
    book.title.toLowerCase().includes(filter) ||
    book.author.toLowerCase().includes(filter) ||
    book.year.toString().includes(filter)
  );

  this.filteredBooks = result;
  this.message = result.length
    ? '✅ Book(s) found.'
    : '❌ No book found with that keyword.';
}


  private refreshBooks(): void {
    this.books = this.bookList.getAll();
    this.filteredBooks = [...this.books];
  }

  private clearForm(): void {
    this.title = '';
    this.author = '';
    this.year = null;
  }
}
