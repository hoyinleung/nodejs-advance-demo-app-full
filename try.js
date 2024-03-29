/* Working with external APIs:

When you're writing code to fetch data from an API, you never know if the API will be down or if it will give you an unexpected response. Using a try-catch block helps you handle those situations gracefully.
Reading and writing to files:

If your code needs to open a file, read from it, or write to it, there's always a chance that the file might not exist, or that you might not have permission to access it. A try-catch block helps you deal with those file-related errors.
Database operations:

Connecting to a database, executing queries, or updating data can sometimes fail. A try-catch block allows you to handle database-related errors and keep your application running smoothly.
User input validation:

When you're getting input from users, like numbers or dates, there's a possibility that they might enter something invalid. Using a try-catch block can help you gracefully handle those input errors.
Network operations:

If your application needs to communicate over a network, like making an HTTP request, the connection might fail or time out. A try-catch block can help you handle these network-related errors. */

// Example function that might throw an error
/* function divideNumbers(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero!');
    }
    return a / b;
  }

  // Using the function with try-catch
  try {
    const result = divideNumbers(2, 0);
    console.log(`The result is: ${result}`);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  } */
async function fetchData(url) {
    const response = await fetch(url);

    // Check for successful response status code (200-299)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data fetched successfully:", data);
}
try {
    fetchData('http://localhost:3001/posts');
} catch (error) {
    console.error("Error fetching data:", error);
}


// 遠端資源 , Fetch api,  fetch database
// 檔案讀寫 read, write
// form submission

// 用時記得try catch兩個一齊用

console.log('End of Program')