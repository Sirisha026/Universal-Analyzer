// Initialize - show home page by default
document.addEventListener('DOMContentLoaded', function() {
  showSection('home');
  document.querySelector('.nav-item').classList.add('active');
});

// Navigation
function showSection(sectionId) {
  document.querySelectorAll('.analyzer-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Number Analysis Functions
function checkNumberProperty(property) {
  const num = parseInt(document.getElementById("numberInput").value);
  const resultsDiv = document.getElementById("numberResults");
  resultsDiv.innerHTML = "";

  if (isNaN(num) || num < 0) {
    showResult("Invalid Input", false, "Please enter a valid positive number.", "numberResults");
    return;
  }

  let result;
  switch(property) {
    case 'palindrome':
      result = checkPalindrome(num);
      break;
    case 'fibonacci':
      result = checkFibonacci(num);
      break;
    case 'perfect':
      result = checkPerfect(num);
      break;
    case 'strong':
      result = checkStrong(num);
      break;
    case 'armstrong':
      result = checkArmstrong(num);
      break;
    case 'prime':
      result = checkPrime(num);
      break;
  }

  showResult(result.label, result.result, result.explanation, "numberResults");
}

// String Analysis Functions
function checkStringProperty(property) {
  const str = document.getElementById("stringInput").value.trim();
  const otherStr = document.getElementById("secondString").value.trim();
  const resultsDiv = document.getElementById("stringResults");
  resultsDiv.innerHTML = "";

  if (str === "") {
    showResult("Invalid Input", false, "Please enter a non-empty string.", "stringResults");
    return;
  }

  let result;
  switch(property) {
    case 'palindrome':
      result = isStringPalindrome(str);
      break;
    case 'anagram':
      if (!otherStr) {
        showResult("Anagram Check", false, "Please enter a second string to compare.", "stringResults");
        return;
      }
      result = isAnagram(str, otherStr);
      break;
    case 'pangram':
      result = isPangram(str);
      break;
    case 'vowelConsonant':
      result = vowelConsonantCount(str);
      break;
  }

  showResult(result.label, result.result, result.explanation, "stringResults");
}

// Helper Functions
function showResult(title, success, explanation, targetDiv) {
  const resultsDiv = document.getElementById(targetDiv);
  const box = document.createElement("div");
  box.className = `result-box ${success ? "" : "fail"}`;
  box.innerHTML = `
    <div class="title">${success ? "✅" : "❌"} ${title}</div>
    <div class="explanation">${explanation}</div>
  `;
  resultsDiv.appendChild(box);
}

// Number Analysis Functions with detailed explanations
function checkPalindrome(num) {
  const str = num.toString();
  const reversed = str.split("").reverse().join("");
  const isPal = str === reversed;
  return {
    label: "Palindrome Check",
    result: isPal,
    explanation: isPal
      ? `The number ${num} reads the same forwards and backwards.<br>
         <strong>How it works:</strong> We reverse the digits (${str} → ${reversed}) and compare.`
      : `The number ${num} is not a palindrome.<br>
         <strong>How it works:</strong> When reversed (${str} → ${reversed}), the numbers don't match.`
  };
}

function checkFibonacci(num) {
  // Generate Fibonacci sequence up to num+1
  let fibSequence = [0, 1];
  while (fibSequence[fibSequence.length - 1] < num + 1) {
    fibSequence.push(fibSequence[fibSequence.length - 1] + fibSequence[fibSequence.length - 2]);
  }

  const isFib = fibSequence.includes(num);
  let explanation = '';
  
  if (isFib) {
    // Find the position in the sequence
    const pos = fibSequence.indexOf(num);
    const prev1 = fibSequence[pos - 1] || '?';
    const prev2 = fibSequence[pos - 2] || '?';
    const next1 = fibSequence[pos + 1] || prev1 + num;
    const next2 = fibSequence[pos + 2] || next1 + num;
    
    explanation = `The number ${num} is a Fibonacci number (position ${pos} in the sequence).<br><br>
      <strong>How Fibonacci sequence works:</strong><br>
      Each number is the sum of the two preceding ones.<br><br>
      <strong>Sequence around ${num}:</strong><br>
      ${prev2}, ${prev1}, <strong>${num}</strong>, ${next1}, ${next2}<br><br>
      <strong>Calculation:</strong><br>
      ${prev2} + ${prev1} = ${num}<br>
      ${prev1} + ${num} = ${next1}<br>
      ${num} + ${next1} = ${next2}`;
  } else {
    // Find the closest Fibonacci numbers
    let lower = 0, higher = 0;
    for (let i = 0; i < fibSequence.length; i++) {
      if (fibSequence[i] < num) lower = fibSequence[i];
      if (fibSequence[i] > num && higher === 0) higher = fibSequence[i];
    }
    
    explanation = `The number ${num} is not in the Fibonacci sequence.<br><br>
      <strong>How Fibonacci sequence works:</strong><br>
      Each number is the sum of the two preceding ones.<br><br>
      <strong>Closest Fibonacci numbers:</strong><br>
      ${lower}, ${higher}<br><br>
      <strong>Why ${num} isn't Fibonacci:</strong><br>
      There are no two consecutive Fibonacci numbers that add up to ${num}.<br><br>
      <strong>Mathematical check:</strong><br>
      A number is Fibonacci if either (5n² + 4) or (5n² - 4) is a perfect square.<br>
      For ${num}:<br>
      5×${num}² + 4 = ${5*num*num + 4} (${Number.isInteger(Math.sqrt(5*num*num + 4)) ? 'perfect square' : 'not perfect square'})<br>
      5×${num}² - 4 = ${5*num*num - 4} (${Number.isInteger(Math.sqrt(5*num*num - 4)) ? 'perfect square' : 'not perfect square'})`;
  }

  return {
    label: "Fibonacci Check",
    result: isFib,
    explanation: explanation
  };
}

function checkPerfect(num) {
  let sum = 0;
  for (let i = 1; i <= num / 2; i++) {
    if (num % i === 0) sum += i;
  }
  return {
    label: "Perfect Number Check",
    result: sum === num,
    explanation: sum === num
      ? `The number ${num} is a perfect number!<br>
         <strong>How it works:</strong> The sum of its proper divisors (${[...Array(Math.floor(num/2)).keys()].map(i => i+1).filter(i => num % i === 0).join(' + ')}) = ${num}.`
      : `The number ${num} is not perfect.<br>
         <strong>How it works:</strong> The sum of its proper divisors is ${sum}, not equal to ${num}.`
  };
}

function checkStrong(num) {
  const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
  let temp = num;
  let sum = 0;
  while (temp > 0) {
    let digit = temp % 10;
    sum += factorial(digit);
    temp = Math.floor(temp / 10);
  }
  return {
    label: "Strong Number Check",
    result: sum === num,
    explanation: sum === num
      ? `The number ${num} is a strong number!<br>
         <strong>How it works:</strong> Sum of factorials of its digits (${num.toString().split('').map(d => `${d}!`).join(' + ')} = ${sum}) equals the number itself.`
      : `The number ${num} is not strong.<br>
         <strong>How it works:</strong> Sum of digit factorials is ${sum}, not equal to ${num}.`
  };
}

function checkArmstrong(num) {
  const str = num.toString();
  let sum = 0;
  for (let ch of str) {
    sum += Math.pow(parseInt(ch), str.length);
  }
  return {
    label: "Armstrong Number Check",
    result: sum === num,
    explanation: sum === num
      ? `The number ${num} is an Armstrong number!<br>
         <strong>How it works:</strong> Sum of its digits raised to the power of digit count (${str.split('').map(d => `${d}^${str.length}`).join(' + ')} = ${sum}) equals the number.`
      : `The number ${num} is not Armstrong.<br>
         <strong>How it works:</strong> Sum of digits^${str.length} is ${sum}, not equal to ${num}.`
  };
}

function checkPrime(num) {
  if (num < 2) return { 
    label: "Prime Number Check", 
    result: false, 
    explanation: `The number ${num} is not prime.<br>
                 <strong>How it works:</strong> By definition, prime numbers must be greater than 1.` 
  };
  
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return {
      label: "Prime Number Check",
      result: false,
      explanation: `The number ${num} is not prime.<br>
                   <strong>How it works:</strong> It's divisible by ${i} (${num} ÷ ${i} = ${num/i}).`
    };
  }
  return {
    label: "Prime Number Check",
    result: true,
    explanation: `The number ${num} is prime!<br>
                 <strong>How it works:</strong> It has no divisors other than 1 and itself.`
  };
}

// String Analysis Functions with detailed explanations
function isStringPalindrome(str) {
  const cleaned = str.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const reversed = cleaned.split("").reverse().join("");
  const isPal = cleaned === reversed;
  return {
    label: "String Palindrome Check",
    result: isPal,
    explanation: isPal
      ? `"${str}" is a palindrome when cleaned (${cleaned}).<br>
         <strong>How it works:</strong> We remove non-letters, lowercase it, and check if it reads the same forwards and backwards.`
      : `"${str}" is not a palindrome.<br>
         <strong>How it works:</strong> When cleaned (${cleaned}) and reversed (${reversed}), the strings don't match.`
  };
}

function isAnagram(str1, str2) {
  const format = (s) => s.replace(/[^a-zA-Z]/g, "").toLowerCase().split("").sort().join("");
  const sorted1 = format(str1);
  const sorted2 = format(str2);
  const result = sorted1 === sorted2;
  return {
    label: "Anagram Check",
    result,
    explanation: result
      ? `"${str1}" and "${str2}" are anagrams!<br>
         <strong>How it works:</strong> When sorted alphabetically, both become "${sorted1}".`
      : `"${str1}" and "${str2}" are not anagrams.<br>
         <strong>How it works:</strong> When sorted, they become "${sorted1}" and "${sorted2}" respectively.`
  };
}

function isPangram(str) {
  const alphabets = new Set("abcdefghijklmnopqrstuvwxyz");
  const found = new Set(str.toLowerCase().replace(/[^a-z]/g, ""));
  const result = [...alphabets].every(char => found.has(char));
  return {
    label: "Pangram Check",
    result,
    explanation: result
      ? `"${str}" is a pangram! It contains all 26 English letters.<br>
         <strong>How it works:</strong> We check if the string contains at least one of each letter from A-Z.`
      : `"${str}" is not a pangram.<br>
         <strong>How it works:</strong> Missing letters: ${[...alphabets].filter(c => !found.has(c)).join(', ')}.`
  };
}

function vowelConsonantCount(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z]/g, "");
  let vowels = 0, consonants = 0;
  for (let ch of cleaned) {
    if ("aeiou".includes(ch)) vowels++;
    else consonants++;
  }
  return {
    label: "Vowel and Consonant Count",
    result: true,
    explanation: `In "${str}" (cleaned as "${cleaned}"):<br>
                 <strong>Vowels:</strong> ${vowels}<br>
                 <strong>Consonants:</strong> ${consonants}<br>
                 <strong>Total letters:</strong> ${cleaned.length}`
  };
}