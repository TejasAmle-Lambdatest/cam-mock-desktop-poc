// Global Mock Camera Injection Script
// This script should be included in any page that needs mock camera functionality
// It reads mock data from localStorage and overrides getUserMedia

console.log('Global Mock Camera: Injection script loaded');

let mockStream = null;
let isMockActive = false;
let originalGetUserMedia = null;

// Check if mock camera is active
function checkMockCameraStatus() {
    const isActive = localStorage.getItem('globalMockCameraActive') === 'true';
    const mockData = localStorage.getItem('globalMockCameraData');
    
    console.log('Global Mock Camera: Checking status', { isActive, hasData: !!mockData });
    
    if (isActive && mockData) {
        try {
            const data = JSON.parse(mockData);
            console.log('Global Mock Camera: Found mock data', data.type);
            return { active: true, data: data };
        } catch (error) {
            console.error('Global Mock Camera: Error parsing mock data', error);
            return { active: false, data: null };
        }
    }
    
    return { active: false, data: null };
}

// Create mock stream from stored data
function createMockStreamFromData(mockData) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (mockData.type === 'video') {
            createVideoStreamFromData(mockData.data, canvas, ctx).then(resolve).catch(reject);
        } else if (mockData.type === 'image') {
            createImageStreamFromData(mockData.data, canvas, ctx).then(resolve).catch(reject);
        } else {
            reject(new Error('Unsupported mock data type'));
        }
    });
}

// Create video stream from data URL
function createVideoStreamFromData(dataUrl, canvas, ctx) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = dataUrl;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        video.onloadeddata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const stream = canvas.captureStream(30);
            
            function drawFrame() {
                if (!video.paused && !video.ended) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    requestAnimationFrame(drawFrame);
                }
            }
            
            video.play().then(() => {
                drawFrame();
                resolve(stream);
            }).catch(reject);
        };
        
        video.onerror = () => reject(new Error('Failed to load video from data'));
    });
}

// Create image stream from data URL
function createImageStreamFromData(dataUrl, canvas, ctx) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = dataUrl;
        
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const stream = canvas.captureStream(30);
            resolve(stream);
        };
        
        img.onerror = () => reject(new Error('Failed to load image from data'));
    });
}

// Override getUserMedia
function overrideGetUserMedia() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Store original function
        originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        
        // Override with mock implementation
        navigator.mediaDevices.getUserMedia = function(constraints) {
            console.log('Global Mock Camera: Intercepting getUserMedia call');
            
            if (isMockActive && mockStream) {
                // Clone the mock stream to avoid conflicts
                const clonedStream = new MediaStream();
                mockStream.getTracks().forEach(track => {
                    clonedStream.addTrack(track.clone());
                });
                console.log('Global Mock Camera: Returning mock stream');
                return Promise.resolve(clonedStream);
            }
            
            console.log('Global Mock Camera: Falling back to real camera');
            return originalGetUserMedia(constraints);
        };
        
        console.log('Global Mock Camera: getUserMedia override installed');
    }
}

// Restore original getUserMedia
function restoreGetUserMedia() {
    if (originalGetUserMedia) {
        navigator.mediaDevices.getUserMedia = originalGetUserMedia;
        originalGetUserMedia = null;
        console.log('Global Mock Camera: getUserMedia override removed');
    }
}

// Initialize mock camera
function initializeMockCamera() {
    const status = checkMockCameraStatus();
    
    if (status.active && status.data) {
        console.log('Global Mock Camera: Initializing with stored data');
        
        createMockStreamFromData(status.data).then(stream => {
            mockStream = stream;
            isMockActive = true;
            overrideGetUserMedia();
            console.log('Global Mock Camera: Mock stream created and override installed');
        }).catch(error => {
            console.error('Global Mock Camera: Error creating mock stream', error);
        });
    } else {
        console.log('Global Mock Camera: No active mock camera found');
    }
}

// Listen for storage changes (cross-tab communication)
window.addEventListener('storage', function(e) {
    if (e.key === 'globalMockCameraActive') {
        if (e.newValue === 'true') {
            // Mock camera was started in another tab
            console.log('Global Mock Camera: Mock camera started in another tab');
            setTimeout(() => {
                initializeMockCamera();
            }, 100);
        } else {
            // Mock camera was stopped in another tab
            console.log('Global Mock Camera: Mock camera stopped in another tab');
            if (mockStream) {
                mockStream.getTracks().forEach(track => track.stop());
                mockStream = null;
            }
            isMockActive = false;
            restoreGetUserMedia();
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Global Mock Camera: DOM loaded, initializing...');
    setTimeout(() => {
        initializeMockCamera();
    }, 100);
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    console.log('Global Mock Camera: DOM already loaded, initializing immediately...');
    setTimeout(() => {
        initializeMockCamera();
    }, 100);
}

// Mark script as loaded
window.globalMockCameraLoaded = true;
console.log('Global Mock Camera: Injection script ready');
