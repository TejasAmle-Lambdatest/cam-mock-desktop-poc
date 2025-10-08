# 🎥 Mock Camera System

A cross-tab mock camera system that allows you to replace real camera feeds with uploaded video/image files across multiple browser tabs. Perfect for testing web applications that require camera access without exposing your actual camera.

## 📋 Product Requirements Document (PRD)

### **Problem Statement**
Web developers and testers need a way to test camera-dependent applications without using their real camera feed. This is especially important for:
- Privacy protection during testing
- Consistent test scenarios
- Testing with specific video content
- Cross-tab camera functionality testing

### **Solution**
A web-based mock camera system that:
- ✅ **Uploads media files** (MP4, WebM, JPG, PNG)
- ✅ **Replaces camera streams** across all browser tabs
- ✅ **Works with any website** that uses `getUserMedia()`
- ✅ **No browser extensions** required
- ✅ **Simple setup** with minimal dependencies

### **Key Features**
- **Global Mock Camera**: Works across all browser tabs
- **File Upload Support**: Videos and images up to 5MB
- **Real-time Preview**: See your mock feed before activation
- **Cross-tab Synchronization**: Uses localStorage for tab communication
- **Easy Integration**: Single script injection for any website

### **Technical Requirements**
- Modern web browser with localStorage support
- Local web server (Python, Node.js, or any HTTP server)
- File size limit: 5MB for optimal performance
- Supported formats: MP4, WebM, JPG, PNG

---

## 🚀 Quick Start

### **1. Setup**
```bash
# Clone or download the project
cd cam-mock-desktop

# Start a local web server
python3 -m http.server 8000
# OR
npx http-server -p 8000
```

### **2. Open Mock Camera Control**
```
http://localhost:8000/global-mock-camera.html
```

### **3. Upload & Activate**
1. **Upload a file**: Click the upload area and select a video or image
2. **Preview**: See your media in the preview section
3. **Start Global Mock**: Click "Start Global Mock Camera"
4. **Test**: Click "Start Camera" to see your mock feed

### **4. Test on Other Websites**
```
http://localhost:8000/test-website.html
```

---

## 📁 Project Structure

```
cam-mock-desktop/
├── global-mock-camera.html    # Main control interface
├── global-mock-inject.js      # Cross-tab injection script
├── test-website.html          # Test page for verification
└── README.md                  # This documentation
```

---

## 🔧 How It Works

### **Architecture**
1. **Control Interface** (`global-mock-camera.html`)
   - File upload and preview
   - Mock camera activation/deactivation
   - Data storage in localStorage

2. **Injection Script** (`global-mock-inject.js`)
   - Overrides `navigator.mediaDevices.getUserMedia()`
   - Reads mock data from localStorage
   - Creates mock MediaStream from uploaded files

3. **Cross-tab Communication**
   - Uses localStorage for data persistence
   - Storage events for real-time updates
   - Automatic injection on page load

### **Technical Flow**
```
1. User uploads file → Base64 conversion → localStorage storage
2. User activates mock → localStorage flag set → Storage event fired
3. Other tabs detect event → Load injection script → Override getUserMedia
4. Website calls getUserMedia → Returns mock stream instead of real camera
```

---

## 🎯 Usage Examples

### **For Web Developers**
```html
<!-- Include in your test pages -->
<script src="http://localhost:8000/global-mock-inject.js"></script>

<!-- Your existing camera code works unchanged -->
<script>
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // This will now use your mock video instead of real camera
    videoElement.srcObject = stream;
  });
</script>
```

### **For Testers**
1. **Setup**: Start the mock camera with your test video
2. **Navigate**: Go to any website that uses camera
3. **Verify**: The website should show your mock video instead of real camera
4. **Test**: Works across multiple tabs simultaneously

---

## 🛠️ Advanced Configuration

### **File Size Limits**
- **Maximum file size**: 5MB
- **Recommended**: 3MB for optimal performance
- **Supported formats**: MP4, WebM, JPG, PNG

### **Custom Integration**
```javascript
// Check if mock camera is active
const isMockActive = localStorage.getItem('globalMockCameraActive') === 'true';

// Get mock camera data
const mockData = JSON.parse(localStorage.getItem('globalMockCameraData') || '{}');

// Manual activation
localStorage.setItem('globalMockCameraActive', 'true');
```

---

## 🐛 Troubleshooting

### **Common Issues**

**❌ "File too large" error**
- **Solution**: Use a smaller file (under 3MB)
- **Alternative**: Compress your video before uploading

**❌ Mock camera not working on other tabs**
- **Check**: Ensure `global-mock-inject.js` is included
- **Verify**: Mock camera is activated in control interface
- **Debug**: Check browser console for errors

**❌ Real camera still showing**
- **Solution**: Refresh the page after activating mock camera
- **Check**: Ensure localStorage contains mock data
- **Verify**: Injection script is loaded correctly

### **Debug Steps**
1. Open browser DevTools (F12)
2. Check Console for error messages
3. Verify localStorage contains `globalMockCameraActive: 'true'`
4. Ensure `global-mock-inject.js` is loaded on the target page

---

## 🔒 Security & Privacy

### **Data Storage**
- Files are stored locally in browser's localStorage
- No data is sent to external servers
- Files are automatically cleared when mock camera is stopped

### **Privacy Protection**
- Real camera is never accessed when mock is active
- Mock camera works offline
- No network requests for mock functionality

---

## 🚀 Future Enhancements

### **Planned Features**
- [ ] **Audio support** for mock camera streams
- [ ] **Multiple mock cameras** (front/back camera simulation)
- [ ] **Video compression** for larger files
- [ ] **Preset mock scenarios** (interview, presentation, etc.)
- [ ] **Browser extension** for easier integration

### **Technical Improvements**
- [ ] **IndexedDB support** for larger files
- [ ] **WebRTC simulation** for more realistic testing
- [ ] **Performance optimization** for large files
- [ ] **Cross-browser compatibility** testing

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are served from the same domain
4. Verify file size limits are respected

---

**Happy Testing! 🎥✨**