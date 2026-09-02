export const getBookTitle = (borrowing) => {
  if (typeof borrowing.book === 'string') return borrowing.book
  return borrowing.book?.title ?? borrowing.book_title ?? `#${borrowing.book_id ?? '—'}`
}

export const getBookAuthor = (borrowing) =>
  typeof borrowing.book === 'object' ? (borrowing.book?.author ?? borrowing.book_author ?? '') : ''

export const getMemberName = (borrowing) => {
  if (typeof borrowing.member === 'string') return borrowing.member
  return borrowing.member?.name ?? borrowing.user?.name ?? borrowing.member_name ?? `#${borrowing.member_id ?? borrowing.user_id ?? '—'}`
}

export const getBorrowedDate = (borrowing) =>
  borrowing.borrowed_at ?? borrowing.borrow_date ?? borrowing.created_at ?? null

export const getDueDate = (borrowing) =>
  borrowing.due_date ?? borrowing.due_at ?? null

export const getReturnedDate = (borrowing) =>
  borrowing.returned_at ?? borrowing.return_date ?? null

export const isReturned = (borrowing) =>
  !!getReturnedDate(borrowing) || borrowing.status === 'returned'

export const isOverdue = (borrowing) => {
  if (isReturned(borrowing)) return false
  if (typeof borrowing.is_overdue === 'boolean') return borrowing.is_overdue
  if (borrowing.status === 'overdue') return true
  const due = getDueDate(borrowing)
  if (!due) return false
  return new Date(due).getTime() < Date.now()
}

export const getStatus = (borrowing) => {
  if (isReturned(borrowing)) return 'returned'
  if (isOverdue(borrowing)) return 'overdue'
  return 'active'
}
