
# Source path
source = "/home/User/Documents/file.txt"
 
# Destination path
destination = "/home/User/Documents"
 
# Copy the content of
# source to destination
 
try:
    shutil.copyfile(source, destination)
    print("File copied successfully.")
 
# If source and destination are same
except shutil.SameFileError:
    print("Source and destination represents the same file.")
 
# If destination is a directory.
except IsADirectoryError:
    print("Destination is a directory.")
 
# If there is any permission issue
except PermissionError:
    print("Permission denied.")
 
# For other errors
except:
    print("Error occurred while copying file.")




# Source path
source = "/home/User/Documents/file.txt"
 
# Destination path
destination = "/home/User/Documents/file.txt"
 
# Copy the content of
# source to destination
 
try:
    shutil.copy(source, destination)
    print("File copied successfully.")
 
# If source and destination are same
except shutil.SameFileError:
    print("Source and destination represents the same file.")
 
# If there is any permission issue
except PermissionError:
    print("Permission denied.")
 
# For other errors
except:
    print("Error occurred while copying file.")


# this will return a tuple of root and extension
split_tup = os.path.splitext('my_file.txt')
print(split_tup)
  
# extract the file name and extension
file_name = split_tup[0]
file_extension = split_tup[1]
  
print("File Name: ", file_name)
print("File Extension: ", file_extension)