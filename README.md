# Facts-Only Mutual Fund Assistant

A RAG-based chatbot that answers factual questions about selected mutual fund schemes using official sources only.

## Project Overview

Facts-Only Mutual Fund Assistant is designed to provide concise, verifiable information about mutual fund schemes without providing investment advice or return predictions.

### Supported Schemes

- SBI Blue Chip Fund
- SBI Flexicap Fund
- SBI ELSS Tax Saver Fund

### Architecture

User Question
→ Query Classification
→ Official Document Retrieval
→ Relevant Context
→ LLM
→ Grounded Factual Answer
→ Source Citation

## Official Source List

The chatbot is restricted to official sources from the following organizations:

### SBI Mutual Fund
- SBI Mutual Fund Factsheets:
  https://www.sbimf.com/factsheets
- SBI Flexicap Fund:
  https://www.sbimf.com/campaign/flexicap-fund
- SBI ELSS Tax Saver Fund:
  https://www.sbimf.com/campaign/sbi-elss-tax-saver-fund

### SEBI
- SEBI Investor Education:
  https://investor.sebi.gov.in/
- SEBI Financial Education Booklet:
  https://investor.sebi.gov.in/pdf/downloadable-documents/Financial%20Education%20Booklet%20-%20English.pdf
- SEBI Mutual Fund Regulations:
  https://www.sebi.gov.in/sebiweb/home/HomeAction.do?sid=6&smid=0&ssid=3

### AMFI
- AMFI Investor Corner:
  https://www.amfiindia.com/investor
- AMFI Introduction to Mutual Funds:
  https://www.amfiindia.com/investor/knowledge-center-info?zoneName=IntroductionMutualFunds
- AMFI Investor Awareness Program:
  https://www.amfiindia.com/investor/investor-awareness-program

> Only official SBI Mutual Fund, SEBI and AMFI sources are permitted as evidence for factual answers.

## Sample Q&A

### Q1. What is the expense ratio of SBI Blue Chip Fund?

**Expected behavior:**  
The assistant retrieves the relevant official SBI Mutual Fund document and returns the verified expense-ratio value with exactly one source citation.

### Q2. What is the minimum SIP amount for SBI Flexicap Fund?

**Expected behavior:**  
The assistant retrieves the relevant official SBI Mutual Fund document and returns the verified minimum SIP amount with exactly one source citation.

### Q3. What is the lock-in period for SBI ELSS Tax Saver Fund?

**Answer:**  
The SBI ELSS Tax Saver Fund has a 3-year lock-in period. The information is stated in SBI Mutual Fund's official scheme material.

### Q4. Should I invest in SBI Flexicap Fund?

**Answer:**  
I can provide factual information about this scheme, but I can't provide investment advice or recommend whether you should invest. You can ask me about the scheme's expense ratio, exit load, minimum SIP, riskometer, benchmark, or other factual details.

### Q5. Will this fund give me 20% returns?

**Answer:**  
I can provide factual information about this scheme, but I can't provide investment advice or recommend whether you should invest. You can ask me about the scheme's expense ratio, exit load, minimum SIP, riskometer, benchmark, or other factual details.

### Q6. What is my PAN number?

**Answer:**  
Please do not share PAN, Aadhaar, OTPs, bank or account details, phone numbers, email addresses, or other personal information with this chatbot.

## Disclaimer

This chatbot provides factual information from official sources available in its knowledge base. It does not provide investment advice, investment recommendations, return predictions, personalized financial guidance, or guarantees of investment performance.

If the requested information cannot be verified from the available official sources, the chatbot responds:

> "I couldn't verify this information from the official sources available to me. Please check the latest official scheme documents."

Mutual fund investments are subject to market risks. Users should read all scheme-related documents carefully.

## Privacy

Users should never provide:

- PAN
- Aadhaar
- OTPs
- Bank account details
- Account numbers
- Phone numbers
- Email addresses
- Other personal information

## Technology

- Frontend: HTML, CSS, JavaScript
- Backend: Hatchable API
- RAG: Hatchable Knowledge Base
- LLM: Hatchable AI
- Embeddings: OpenAI
- Database: PostgreSQL
- Source control: GitHub

## Project Link

Working prototype:

https://facts-only-mutual.hatchable.site/

GitHub:

https://github.com/Pavan-Karthik-Udayagiri/facts-only-mutual-fund-assistant
