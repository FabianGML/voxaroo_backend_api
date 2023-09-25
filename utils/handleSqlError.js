export const handleSqlError = (error) => {
  // If there is an error because the username or email already exist in the db, we return the field name where the error ocurred
  if (error.code === 'ER_DUP_ENTRY') {
    const duplicatedValue = error.sqlMessage.split("'")[3].split('.')[1]
    return { error: duplicatedValue }
  }
}
