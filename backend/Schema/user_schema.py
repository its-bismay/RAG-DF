def individual_serial(User) -> dict:
    return {
        "id": str(User["_id"]),
        "username": User["username"],
        "email": User["email"],
        "password":User["Password"]
    }
    
    
def list_serial(Users) -> list:
    return [individual_serial(User) for User in Users]