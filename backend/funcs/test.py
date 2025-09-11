## test.py
## use searborn to plot a heatmap of a correlation matrix
import seaborn as sns
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# generate a random correlation matrix
correlation_matrix = np.random.rand(10, 10)
correlation_matrix = pd.DataFrame(correlation_matrix, columns=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"])

# plot the correlation matrix, annotate the values, use red for cmap
plt.figure(figsize=(10, 10))
sns.heatmap(correlation_matrix, annot=True, cmap="Reds")
plt.show()

## save the plot as a png file
plt.savefig("correlation_matrix.png")