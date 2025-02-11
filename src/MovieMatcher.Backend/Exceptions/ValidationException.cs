namespace MovieMatcher.Backend.Exceptions;

/// <summary>
/// Thrown when validation rules for a request or entity are not satisfied.
/// Use this exception to represent errors where user input or state does not meet
/// the expected format or rules.
/// </summary>
public class ValidationException : DomainException
{
    public ValidationException(string message, IDictionary<string, string[]> errors = null)
        : base(message)
    {
        Errors = errors ?? new Dictionary<string, string[]>();
    }

    /// <summary>
    /// A collection of validation errors, where the key is the property name,
    /// and the value is an array of error messages.
    /// </summary>
    public IDictionary<string, string[]> Errors { get; }
}
