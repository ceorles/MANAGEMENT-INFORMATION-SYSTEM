from django.contrib import admin
from .models import Student, Librarian, Book, BorrowRecord

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'get_name', 'contact_number', 'sex')
    search_fields = ('student_id', 'user__first_name', 'user__last_name')
    
    def get_name(self, obj):
        return obj.user.first_name
    get_name.short_description = 'Name'

@admin.register(Librarian)
class LibrarianAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'get_name')
    
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
    
    def get_name(self, obj):
        return obj.user.first_name
    get_name.short_description = 'Name'

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'quantity', 'isbn')
    list_filter = ('category',)
    search_fields = ('title', 'author')

@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'get_book', 'borrow_date', 'is_returned')
    list_filter = ('is_returned', 'borrow_date')
    
    def get_student(self, obj):
        return obj.student.user.first_name
    get_student.short_description = 'Student'
    
    def get_book(self, obj):
        return obj.book.title
    get_book.short_description = 'Book'