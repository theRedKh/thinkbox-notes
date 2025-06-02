# ⚡New Stuff
- JSON:  .parse: convert strings to objects
- .localStorage: property from Window interface to access storage objects from document origin

# Security
### Web Crypto API

#### 🔐 Key Concepts:
Concept	--- What It Means
- Plaintext --- The original note (e.g., “My password is 1234”)
- Ciphertext --- The encrypted version (e.g., “dfi8J29X78...” — unreadable without a key)
- Key	--- A secret used to encrypt/decrypt (you can generate it or derive from a passphrase)
- Web Crypto API --- A secure browser tool for doing encryption/decryption
- AES-GCM --- A modern encryption algorithm you can use securely in the browser

### Encryption Algorithms
- Symmetric encryption: same key to encrypt and decrypt
    - AES - industry standard and secure when used properly
    - ChaCha20-Poly1305 - very fast on mobile/low power devices, modern alternative to AES
    - DES/3DES - depreciated, weak and insecure
    - RC4, Blowfish - legacy and insecure
- AES Modes:
    - ECB - electronic codebook - leaks patterns, not good
    - CBC - cipher block chaining - not authenticated, vulnerable to bit flipping
    - GCM - galois counter mode - fast, authenticated, but needs good randomness for IV
    - CTR - counter mode - stream-like, fast but not authenticated
    -- CHOSEN ALGORITHM AES-GCM
- Asymmetric encryption should be used for exchange of keys, like in direct messaging
- Modes in encryption - strategies for applying algorithm to a lot of data
- IV - or initialization vector - a random number used to make encryption non-deterministic