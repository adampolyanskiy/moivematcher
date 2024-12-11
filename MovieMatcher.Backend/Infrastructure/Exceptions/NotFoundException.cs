namespace MovieMatcher.Backend.Exceptions;

/// <summary>
/// Thrown when a requested resource or entity cannot be found.
/// Use this exception when an operation requires a resource (e.g., an entity from the database),
/// and that resource is not available.
/// </summary>
public class NotFoundException : DomainException
{
    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}