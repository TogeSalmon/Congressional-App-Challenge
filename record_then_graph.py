import sounddevice as sd
import scipy.io.wavfile as wav
import numpy as np
import matplotlib.pyplot as plt

# Set parameters for audio recording
sample_rate = 44100  # You can adjust this based on your preference
duration = 5        # Duration in seconds
output_filename = 'recorded_audio.wav'

# Record audio
print("Recording... Press Ctrl+C to stop recording.")
recorded_audio = sd.rec(int(sample_rate * duration), samplerate=sample_rate, channels=1)
sd.wait()  # Wait for recording to finish

# Save recorded audio to a WAV file
wav.write(output_filename, sample_rate, recorded_audio)
print(f"Audio recorded and saved as {output_filename}")

# Perform FFT on recorded audio
fft_result = np.fft.fft(recorded_audio[:, 0])
freqs = np.fft.fftfreq(len(fft_result), 1.0 / sample_rate)
magnitude = np.abs(fft_result)

# Plot the frequency spectrum
plt.figure(figsize=(10, 6))
plt.plot(freqs[:len(freqs)//2], magnitude[:len(magnitude)//2])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.title('Frequency Spectrum of Recorded Audio')
plt.grid()
plt.show()
