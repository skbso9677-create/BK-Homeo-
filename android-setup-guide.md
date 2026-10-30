# BK Homeo — Android Project Setup & GitHub Actions APK Guide

## स्टोर की जानकारी (Store Details)
- **दुकान का नाम**: B K HOMEOPATHIC STORE
- **ऐप का नाम**: BK Homeo
- **संचालक / डॉक्टर**: Dr. Sonu Kumar
- **पता**: किसानपुरा नाला पटरी, सहारनपुर, उत्तर प्रदेश, भारत (PIN: 247001)
- **मोबाइल / व्हाट्सऐप**: 6395352618

---

## मोबाइल फोन से APK कैसे बनाएं (Mobile Step-by-Step Hindi Guide)

आपके इस प्रोजेक्ट में सभी फाइलें (React 19, Vite, Tailwind CSS, Capacitor Config और GitHub Actions Workflow) पूरी तरह तैयार हैं।

### चरण 1: GitHub पर नया रिपॉजिटरी बनाएं
1. अपने मोबाइल फोन के क्रोम ब्राउज़र में **github.com** खोलें (यदि खाता नहीं है, तो 1 मिनट में फ्री में साइन अप करें)।
2. ऊपर दाएँ कोने में `+` आइकॉन पर टैप करें और **New repository** चुनें।
3. Repository name में लिखें: `bk-homeo`
4. इसे **Public** रखें और **Create repository** पर टैप करें।

### चरण 2: प्रोजेक्ट कोड GitHub पर अपलोड करें
- आप सीधे अपने फोन से GitHub वेबसाइट पर "uploading an existing file" विकल्प से इस ZIP की फाइलें अपलोड कर सकते हैं।
- या अपने मोबाइल में Termux ऐप से ये 3 कमांड्स चला सकते हैं:
  ```bash
  git init
  git add .
  git commit -m "BK Homeo Store App Initial Commit"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/bk-homeo.git
  git push -u origin main
  ```

### चरण 3: GitHub Actions खुद क्लाउड में 2 मिनट में APK बनाएगा
1. जैसे ही कोड पुश होगा, GitHub वेबसाइट पर **Actions** टैब पर जाएं।
2. वहां **"Build Android APK (BK Homeo)"** नाम का वर्कफ़्लो अपने आप चल रहा होगा।
3. GitHub का क्लाउड सर्वर बिना किसी कंप्यूटर के खुद:
   - Node.js और Java 17 सेटअप करेगा।
   - Web App को बिल्ड करेगा (`dist`).
   - Android Gradle चलाकर `app-debug.apk` तैयार करेगा।

### चरण 4: APK डाउनलोड और फोन में इंस्टॉल करें
1. वर्कफ़्लो पूरा होते ही (हरा सही का निशान आने पर), उस पर टैप करें।
2. नीचे **Artifacts** सेक्शन में जाएं।
3. **`BK-Homeo-Android-v1.0-debug`** (ZIP) पर टैप करके डाउनलोड करें।
4. अनज़िप करने पर आपको **`app-debug.apk`** फाइल मिलेगी।
5. उस पर टैप करें और "Install" दबाएं।
6. **BK Homeo** अब आपके फोन में बिना किसी ब्राउज़र के एक असली एंड्रॉइड ऐप के रूप में चलेगा!
