namespace MovieMatcher.Backend.Exceptions;

/// <summary>
/// Thrown when a resource conflict occurs, such as a duplicate entry or violation
/// of unique constraints.
/// Use this exception to represent cases where an operation cannot proceed due to
/// conflicting states.
/// </summary>
public class ConflictException : DomainException
{
    public ConflictException(string message)
        : base(message)
    {
    }

    public ConflictException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}